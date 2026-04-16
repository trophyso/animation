#!/bin/bash

# Examples:
#   ./generate-thumbnail.sh "Trophy Updates" "/assets/user_attributes.png"
#   ./generate-thumbnail.sh --no-image-border "7 Health App Gamification Examples" "/assets/fitbit-gamification.png"

NO_IMAGE_BORDER=0
REMAINING=()
while [ $# -gt 0 ]; do
    case "$1" in
        --no-image-border)
            NO_IMAGE_BORDER=1
            shift
            ;;
        *)
            REMAINING+=("$1")
            shift
            ;;
    esac
done

if [ -z "${REMAINING[0]}" ]; then
    echo "Error: Title is required"
    echo "Usage: ./generate-thumbnail.sh [--no-image-border] \"Your Title Here\" [\"/assets/image.png\"]"
    exit 1
fi

TITLE="${REMAINING[0]}"
IMAGE_URL="${REMAINING[1]:-}"

if [ "$NO_IMAGE_BORDER" -eq 1 ]; then
    PROPS="{\"title\": \"$TITLE\", \"imageUrl\": \"$IMAGE_URL\", \"imageBorder\": false}"
else
    PROPS="{\"title\": \"$TITLE\", \"imageUrl\": \"$IMAGE_URL\"}"
fi

# Create filename from title (replace spaces with underscores)
FILENAME=$(echo "$TITLE" | tr ' -' '_').png

# Run the remotion command
npx remotion still GenericThumbnailImage \
    --image-format=png \
    --props="$PROPS" \
    --output="./out/$FILENAME" \
    --overwrite=true
