#!/bin/bash
# Find manage.py and run makemigrations using uv

set -e

# Find the directory containing manage.py within the 'manager' folder
MANAGE_PY_DIR=$(find manager -name "manage.py" -not -path "*/.*" | head -n 1 | xargs dirname)

if [ -z "$MANAGE_PY_DIR" ]; then
    echo "Error: manage.py not found in the current project."
    exit 1
fi

echo "Found manage.py in $MANAGE_PY_DIR"

# Change to that directory
cd "$MANAGE_PY_DIR"

# Run makemigrations using uv
echo "Running: uv run manage.py makemigrations"
uv run manage.py makemigrations
