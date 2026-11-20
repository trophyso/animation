#!/bin/bash

# Renders the GenericThumbnailImage still: the same design as the web repo's
# Open Graph image (src/app/og/route.tsx), 1200x630.
#
# The sky and person are picked from the title (so a title always gets the
# same image) unless pinned with --sky / --person.
#
# Examples:
#   ./generate-thumbnail.sh "Trophy Updates"
#   ./generate-thumbnail.sh --sky dusk --person priya "7 Health App Gamification Examples"

SKIES="dawn morning noon afternoon dusk night"
PEOPLE="tom joe priya sam mei leo ellie aisha"

usage() {
    echo "Usage: ./generate-thumbnail.sh [--sky SKY] [--person PERSON] \"Your Title Here\""
    echo "  --sky     one of: $SKIES"
    echo "  --person  one of: $PEOPLE"
}

SKY=""
PERSON=""
REMAINING=()
while [ $# -gt 0 ]; do
    case "$1" in
        --sky)
            if ! [[ " $SKIES " == *" ${2:-} "* ]] || [ -z "${2:-}" ]; then
                echo "Error: --sky must be one of: $SKIES" >&2
                exit 1
            fi
            SKY="$2"
            shift 2
            ;;
        --person)
            if ! [[ " $PEOPLE " == *" ${2:-} "* ]] || [ -z "${2:-}" ]; then
                echo "Error: --person must be one of: $PEOPLE" >&2
                exit 1
            fi
            PERSON="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            REMAINING+=("$1")
            shift
            ;;
    esac
done

if [ -z "${REMAINING[0]}" ]; then
    echo "Error: Title is required" >&2
    usage >&2
    exit 1
fi

if [ -n "${REMAINING[1]}" ]; then
    echo "Error: unexpected argument \"${REMAINING[1]}\" (thumbnails no longer take an image)" >&2
    usage >&2
    exit 1
fi

TITLE="${REMAINING[0]}"

PROPS="{\"title\": \"$TITLE\""
[ -n "$SKY" ] && PROPS="$PROPS, \"sky\": \"$SKY\""
[ -n "$PERSON" ] && PROPS="$PROPS, \"person\": \"$PERSON\""
PROPS="$PROPS}"

# Create filename from title (replace spaces with underscores)
FILENAME=$(echo "$TITLE" | tr ' -' '_').png

# Run the remotion command
npx remotion still GenericThumbnailImage \
    --image-format=png \
    --props="$PROPS" \
    --output="./out/$FILENAME" \
    --overwrite=true
