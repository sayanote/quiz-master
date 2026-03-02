---
name: django-makemigrations
description: Automate the creation of Django migrations using uv. Trigger this skill whenever Django models (typically in models.py) are added, modified, or deleted to ensure the database schema remains in sync with the model definitions.
---

# Django Makemigrations

## Overview

This skill provides a streamlined workflow for generating Django migration files. It automatically locates the `manage.py` file within the project structure and executes `uv run manage.py makemigrations`.

## Trigger Scenarios

- **Model Changes:** After you or the user modifies `models.py` (adding fields, changing field types, deleting models).
- **New App Creation:** After creating a new Django app and defining its initial models.
- **Manual Request:** When the user explicitly asks to "make migrations" or "prepare database changes."

## Workflow

1.  **Detect Changes:** Identify that Django models have been modified.
2.  **Locate manage.py:** The skill will automatically find the project's `manage.py`.
3.  **Run Makemigrations:** Execute the bundled script: `scripts/makemigrations.sh`.
4.  **Verify Output:** Check the command output for newly created migration files (e.g., `0002_auto_...py`).
5.  **Inform User:** Briefly notify the user that migrations have been generated.

## Bundled Resources

### scripts/makemigrations.sh
A shell script that:
- Recursively searches for `manage.py` (excluding hidden directories).
- Changes to the directory containing `manage.py`.
- Executes `uv run manage.py makemigrations`.
