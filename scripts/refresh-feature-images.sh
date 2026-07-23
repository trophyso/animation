#!/usr/bin/env bash
#
# Refresh feature images for Ghost blog posts.
#
# Requires: curl, jq, openssl, and the Remotion toolchain used by generate-thumbnail.sh
#
# Environment (optionally via .env in the repo root):
#   GHOST_URL              Site URL, e.g. https://blog.example.com
#   GHOST_CONTENT_API_KEY  Content API key
#   GHOST_ADMIN_API_KEY    Admin API key (id:secret)
#
# Usage:
#   ./scripts/refresh-feature-images.sh [--limit N] [--offset N] [--slug SLUG] [--test]
#   npm run generate:feature-images -- --test --limit 3
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

if [ -f .env ]; then
    set -a
    # shellcheck disable=SC1091
    source .env
    set +a
fi

usage() {
    cat <<'EOF'
Usage: ./scripts/refresh-feature-images.sh [--limit N] [--offset N] [--slug SLUG] [--test]

  --limit N    Process only N posts (after --offset, oldest first)
  --offset N   Skip the first N posts (oldest first); useful to resume a run
  --slug SLUG  Process only the post with this slug (no-op if not found)
  --test       Generate images locally; skip Ghost upload and post update

Requires env: GHOST_URL, GHOST_CONTENT_API_KEY, GHOST_ADMIN_API_KEY
Requires tools: curl, jq, openssl
EOF
}

LIMIT=""
OFFSET=0
SLUG=""
TEST_MODE=0

while [ $# -gt 0 ]; do
    case "$1" in
        --limit)
            if [ -z "${2:-}" ] || ! [[ "${2}" =~ ^[0-9]+$ ]] || [ "${2}" -lt 1 ]; then
                echo "Error: --limit requires a positive integer" >&2
                exit 1
            fi
            LIMIT="$2"
            shift 2
            ;;
        --offset)
            if [ -z "${2:-}" ] || ! [[ "${2}" =~ ^[0-9]+$ ]]; then
                echo "Error: --offset requires a non-negative integer" >&2
                exit 1
            fi
            OFFSET="$2"
            shift 2
            ;;
        --slug)
            if [ -z "${2:-}" ]; then
                echo "Error: --slug requires a value" >&2
                exit 1
            fi
            SLUG="$2"
            shift 2
            ;;
        --test)
            TEST_MODE=1
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo "Error: unknown option: $1" >&2
            usage >&2
            exit 1
            ;;
    esac
done

for cmd in curl jq openssl; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "Error: $cmd is required but not installed" >&2
        exit 1
    fi
done

if [ -z "${GHOST_URL:-}" ] || [ -z "${GHOST_CONTENT_API_KEY:-}" ] || [ -z "${GHOST_ADMIN_API_KEY:-}" ]; then
    echo "Error: GHOST_URL, GHOST_CONTENT_API_KEY, and GHOST_ADMIN_API_KEY must be set" >&2
    exit 1
fi

GHOST_URL="${GHOST_URL%/}"
ACCEPT_VERSION="v5.0"

base64_url_encode() {
    openssl base64 -e -A | tr '+/' '-_' | tr -d '='
}

ghost_admin_token() {
    local id secret now exp header payload header_b64 payload_b64 header_payload signature
    IFS=':' read -r id secret <<< "$GHOST_ADMIN_API_KEY"
    if [ -z "$id" ] || [ -z "$secret" ]; then
        echo "Error: GHOST_ADMIN_API_KEY must be in id:secret format" >&2
        exit 1
    fi
    now=$(date +%s)
    exp=$((now + 300))
    header="{\"alg\":\"HS256\",\"typ\":\"JWT\",\"kid\":\"$id\"}"
    payload="{\"iat\":$now,\"exp\":$exp,\"aud\":\"/admin/\"}"
    header_b64=$(printf '%s' "$header" | base64_url_encode)
    payload_b64=$(printf '%s' "$payload" | base64_url_encode)
    header_payload="${header_b64}.${payload_b64}"
    signature=$(printf '%s' "$header_payload" | openssl dgst -binary -sha256 -mac HMAC -macopt "hexkey:${secret}" | base64_url_encode)
    printf '%s' "${header_payload}.${signature}"
}

# Escape \ and " so generate-thumbnail.sh can embed the title in JSON props safely.
escape_title_for_thumbnail() {
    printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

thumbnail_output_path() {
    local title="$1"
    local filename
    filename=$(printf '%s' "$title" | tr ' -' '_').png
    printf './out/%s' "$filename"
}

fetch_posts() {
    local page=1
    local page_limit=100
    local collected='[]'
    local response posts_page total_pages url encoded_slug count want

    # Fetch enough posts to cover offset + limit (when limit is set).
    want=""
    if [ -n "$LIMIT" ]; then
        want=$((OFFSET + LIMIT))
        if [ "$want" -lt "$page_limit" ]; then
            page_limit="$want"
        fi
    fi

    while true; do
        url="${GHOST_URL}/ghost/api/content/posts/?key=${GHOST_CONTENT_API_KEY}&fields=id,title,slug,updated_at&order=published_at%20asc&limit=${page_limit}&page=${page}"
        if [ -n "$SLUG" ]; then
            encoded_slug=$(jq -nr --arg s "$SLUG" '$s | @uri')
            url="${url}&filter=slug:${encoded_slug}"
        fi

        if ! response=$(curl -sS -f --connect-timeout 10 --max-time 60 -H "Accept-Version: ${ACCEPT_VERSION}" "$url"); then
            echo "Error: failed to fetch posts from Ghost Content API" >&2
            exit 1
        fi
        posts_page=$(echo "$response" | jq -c '.posts // []')
        total_pages=$(echo "$response" | jq -r '.meta.pagination.pages // 1')

        # Merge via stdin to avoid huge --argjson CLI args (can hang/stall on large pages).
        collected=$(printf '%s\n%s\n' "$collected" "$posts_page" | jq -c -s 'add')

        if [ -n "$SLUG" ]; then
            break
        fi

        count=$(echo "$collected" | jq 'length')
        if [ -n "$want" ] && [ "$count" -ge "$want" ]; then
            collected=$(echo "$collected" | jq -c ".[0:${want}]")
            break
        fi

        if [ "$page" -ge "$total_pages" ]; then
            break
        fi
        page=$((page + 1))
    done

    if [ -n "$SLUG" ]; then
        printf '%s' "$collected"
        return
    fi

    if [ "$OFFSET" -gt 0 ]; then
        collected=$(echo "$collected" | jq -c ".[${OFFSET}:]")
    fi

    if [ -n "$LIMIT" ]; then
        collected=$(echo "$collected" | jq -c ".[0:${LIMIT}]")
    fi

    printf '%s' "$collected"
}

upload_image() {
    local file_path="$1"
    local ref="$2"
    local token response url safe_path
    # Copy to a path without special chars — curl -F treats ":" after @path as type metadata.
    safe_path=$(mktemp "${TMPDIR:-/tmp}/ghost-upload.XXXXXX")
    cp "$file_path" "$safe_path"
    token=$(ghost_admin_token)
    if ! response=$(curl -sS -f --connect-timeout 10 --max-time 60 \
        -X POST \
        -H "Authorization: Ghost ${token}" \
        -H "Accept-Version: ${ACCEPT_VERSION}" \
        -F "file=@${safe_path};filename=${ref}" \
        -F "ref=${ref}" \
        "${GHOST_URL}/ghost/api/admin/images/upload/"); then
        rm -f "$safe_path"
        echo "Error: failed to upload image ${file_path}" >&2
        exit 1
    fi
    rm -f "$safe_path"
    url=$(echo "$response" | jq -r '.images[0].url // empty')
    if [ -z "$url" ]; then
        echo "Error: image upload did not return a URL" >&2
        echo "$response" >&2
        exit 1
    fi
    printf '%s' "$url"
}

update_post_feature_image() {
    local post_id="$1"
    local feature_image="$2"
    local feature_image_alt="$3"
    local updated_at="$4"
    local token payload response
    token=$(ghost_admin_token)
    payload=$(jq -n \
        --arg feature_image "$feature_image" \
        --arg feature_image_alt "$feature_image_alt" \
        --arg updated_at "$updated_at" \
        '{posts: [{feature_image: $feature_image, feature_image_alt: $feature_image_alt, updated_at: $updated_at}]}')
    if ! response=$(curl -sS -f --connect-timeout 10 --max-time 60 \
        -X PUT \
        -H "Authorization: Ghost ${token}" \
        -H "Accept-Version: ${ACCEPT_VERSION}" \
        -H "Content-Type: application/json" \
        -d "$payload" \
        "${GHOST_URL}/ghost/api/admin/posts/${post_id}/"); then
        echo "Error: failed to update post ${post_id}" >&2
        exit 1
    fi
    echo "$response" | jq -e '.posts[0].id' >/dev/null
}

echo "Fetching posts from Ghost (oldest first)..."
POSTS_JSON=$(fetch_posts)
POST_COUNT=$(echo "$POSTS_JSON" | jq 'length')

if [ "$POST_COUNT" -eq 0 ]; then
    if [ -n "$SLUG" ]; then
        echo "No post found with slug=${SLUG}; nothing to do."
        exit 0
    fi
    echo "No posts returned from Ghost; nothing to do."
    exit 0
fi

if [ "$TEST_MODE" -eq 1 ]; then
    echo "Test mode enabled: images will be generated locally; Ghost will not be updated."
fi

if [ "$OFFSET" -gt 0 ] && [ -z "$SLUG" ]; then
    echo "Skipping first ${OFFSET} post(s) (--offset ${OFFSET})"
fi

echo "Processing ${POST_COUNT} post(s)..."

INDEX=$OFFSET
DISPLAY_TOTAL=$((OFFSET + POST_COUNT))
while IFS= read -r post; do
    INDEX=$((INDEX + 1))
    POST_ID=$(echo "$post" | jq -r '.id')
    TITLE=$(echo "$post" | jq -r '.title')
    POST_SLUG=$(echo "$post" | jq -r '.slug')
    UPDATED_AT=$(echo "$post" | jq -r '.updated_at')

    echo "[${INDEX}/${DISPLAY_TOTAL}] Processing slug=${POST_SLUG}"

    ESCAPED_TITLE=$(escape_title_for_thumbnail "$TITLE")
    OUTPUT_PATH=$(thumbnail_output_path "$ESCAPED_TITLE")

    echo "  Generating thumbnail for title: ${TITLE}"
    ./scripts/generate-thumbnail.sh "$ESCAPED_TITLE"

    if [ ! -f "$OUTPUT_PATH" ]; then
        echo "Error: expected output not found at ${OUTPUT_PATH}" >&2
        exit 1
    fi
    echo "  Generated: ${OUTPUT_PATH}"

    if [ "$TEST_MODE" -eq 1 ]; then
        echo "  Test mode: skipping upload and Ghost update"
        continue
    fi

    IMAGE_URL=$(upload_image "$OUTPUT_PATH" "${POST_SLUG}.png")
    echo "  Uploaded: ${IMAGE_URL}"

    update_post_feature_image "$POST_ID" "$IMAGE_URL" "$TITLE" "$UPDATED_AT"
    echo "  Updated feature_image for slug=${POST_SLUG}"
done < <(echo "$POSTS_JSON" | jq -c '.[]')

echo "Done."
