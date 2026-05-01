# Makefile for QuizMaster 2

.PHONY: run-fe build-fe run stop run-manager test-manager help

# Default target
help:
	@echo "Available commands:"
	@echo "  make run-manager    - Start the Quiz Manager (Django) server"
	@echo "  make test-manager   - Run tests for the Quiz Manager"

# ======================================
# Frontend
# ======================================
run-fe:
	@echo "** Currently this command is not defined. ** Skipped."

build-fe:
	@echo "** Currently this command is not defined. ** Skipped."


# ========================================================
# Run the whole Quiz Master Server using docker compose.
# ========================================================
build:
	@echo "Build all QuizMaster components."
	

run:
	@echo "Run all QuizMaster components using docker compose."
	@docker compose --env-file .env.local up --build -d
	
tail-log:
	@docker compose logs -f
	
	

stop:
	@echo "Stop all QuizMaster components."
	docker compose --env-file .env.local down

stop-rmi:
	@echo "Stop all QuizMaster components and remove images."
	docker-compose down --rmi all


# Run the Django server from the manager/service directory
run-manager:
	@export $$(grep -v '^#' .env.local | xargs) && cd manager/service && ../.venv/bin/python manage.py runserver

# Run the Django tests
test-manager:
	@export $$(grep -v '^#' .env.local | xargs) && cd manager/service && ../.venv/bin/python manage.py test quizzes
