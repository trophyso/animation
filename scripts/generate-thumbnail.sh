#!/bin/bash

# Check if title is provided
if [ -z "$1" ]; then
    echo "Error: Title is required"
    echo "Usage: ./generate-thumbnail.sh \"Your Title Here\""
    exit 1
fi

# Create the JSON props with the provided title
PROPS="{\"title\": \"$1\"}"

# Create filename from title (replace spaces with underscores)
FILENAME=$(echo "$1" | tr ' -' '_').png

# Run the remotion command
npx remotion still GenericThumbnailImage \
    --image-format=png \
    --props="$PROPS" \
    --output="./out/$FILENAME" \
    --overwrite=true
