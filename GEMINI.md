# GEMINI.md - QuizMaster2 Context

## Project Overview
**QuizMaster2** is a comprehensive quiz platform system designed for creating, managing, and hosting quiz games. It consists of a dedicated Quiz Management Service and a Game Core Service.

### Key Components
- **Quiz Service (manager/)**: A Django-based administrative interface for managing quiz data (CRUD operations), tracking usage statistics, and serving quiz data.
- **Game Service (backend/)**: The core server responsible for game flow control, player scoring, and UI distribution (currently implemented as a mock API).

## Tech Stack
- **Languages**: Python (>=3.13)
- **Frameworks**: Django 6.0.2+, json-server (for Mock API)
- **Package Management**: `uv` (for Python dependencies)
- **Database**: SQLite3
- **Tools**: Mermaid (Architecture diagrams)

## Directory Structure
- `manager/`: Quiz data management system.
    - `service/`: Django project root (`admin_site`, `quizzes`).
    - `main.py`: Entry point for the manager package.
- `backend/`: Game master server.
   - Distribute UI to player.
   - Control game flow.
   - Send player quiz data and receive players' answer, judge it.
   - Manage the connection with player
- `docs/`: System design documentation and diagrams.
- `getting_started_django/`: Django learning resources and tutorials.

## Building and Running

### Quiz Manager (Django)
1. Navigate to the service directory:
   ```sh
   cd manager/service
   ```
2. Run the development server:
   ```sh
   python manage.py runserver
   ```
3. Access the admin site at `http://127.0.0.1:8000/admin/`

### Backend Mock API
1. Install `json-server`:
   ```sh
   npm install -g json-server
   ```
2. Run the mock server:
   ```sh
   cd backend
   json-server --watch examples/quiz/choice.json
   ```
3. Access the mock API at `http://localhost:3000/quiz`

## Development Conventions
- **Data Integrity**: The `ChoiceQuiz` model includes validation to ensure correct answer counts do not exceed frequency.
- **Naming**: Follow standard Django naming conventions for apps and models.
- **Documentation**: Update `docs/` and `README.md` when architectural changes occur.
