---
name: quiz-api-doc-updater
description: Updates the Quiz Service API documentation (docs/quiz_service_api.md) to stay in sync with the Django implementation in manager/service/quizzes/. Use this skill when modifying API endpoints, changing request/response formats, or adding new fields to the quiz model that are exposed via the API.
---

# Quiz API Doc Updater

## Overview
This skill ensures that the technical documentation for the Quiz Service API remains accurate and up-to-date. It bridges the gap between the Django implementation (views and models) and the Markdown-based API reference.

## Workflow

1. **Information Gathering**:
   - Read `manager/service/quizzes/views.py` to identify the current API logic, parameters, and response structure.
   - Read `manager/service/quizzes/models.py` to understand the data types and fields being returned.
   - Read `docs/quiz_service_api.md` to get the current state of the documentation.

2. **Analysis**:
   - Compare the implementation with the documentation.
   - Identify added, removed, or modified fields in the JSON response.
   - Note any changes in error handling (e.g., new status codes).
   - Verify if path parameters or HTTP methods have changed.

3. **Update Documentation**:
   - Surgical update: Use `replace` to update specific tables or examples in `docs/quiz_service_api.md`.
   - Ensure the "Response" table accurately reflects the current JSON structure.
   - Update "Example Request" and "Example Response" with realistic data that matches the current implementation.
   - Update the "Errors" section if behavior has changed.

4. **Verification**:
   - Ensure the Markdown formatting (tables, code blocks) remains valid and consistent with the project's style.

## Guidelines
- **Be Precise**: Use the exact field names and types from the Django models and views.
- **Consistency**: Maintain the existing document structure: Endpoint -> Parameters -> Response -> Examples -> Errors.
- **Minimal Changes**: Only update what has actually changed to keep the documentation history clean.
