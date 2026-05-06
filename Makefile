# Makefile for QuizMaster 2

.PHONY: help build run tail-log ps stop stop-rmi run-fe-dev run-be-dev run-manager test-manager migrate-manager createsuperuser-manager

# Default target
help:
	@echo "============================================="
	@echo " Quiz Master 2 - Makefile"
	@echo "============================================="
	@echo ""
	@echo "Available commands:"
	@echo ""
	@echo "  make run			- Run all components"
	@echo "  make stop		   - Stop all components"
	@echo "  make run-be-dev	 - Start the Backend development server"
	@echo "  make build-be	   - Build the Backend service"
	@echo "  make run-manager	- Start the Quiz Manager (Django) server"
	@echo "  make test-manager   - Run tests for the Quiz Manager"
	@echo "  make migrate-manager - Run Django migrations"
	@echo "  make createsuperuser-manager - Create a Django superuser"


# ========================================================
# Run the whole Quiz Master Server syncing together
# using docker compose.
# ========================================================
build:
	@echo "Build all QuizMaster components."
	@docker compose --env-file .env.local build

run:
	@echo "Run all QuizMaster components using docker compose."
	@docker compose --env-file .env.local up --build -d

tail-log:
	@docker compose logs -f

ps:
	@docker compose ps

stop:
	@echo "Stop all QuizMaster components."
	@docker compose --env-file .env.local down

stop-rmi:
	@echo "Stop all QuizMaster components and remove images."
	@docker compose --env-file .env.local down --rmi all

# ======================================
# Frontend Development
# ======================================
run-fe-dev:
	@echo "** Currently this command is not defined. ** Skipped."

# ======================================
# Backend Development
# ======================================
run-be-dev:
	@echo "Run backend development server..."
	@export $$(grep -v '^#' .env.local | xargs) && cd backend && npm run dev


# ======================================
# Quiz Manager (Django)
# ======================================

# Run the Django server from the manager/service directory
run-manager:
	@export $$(grep -v '^#' .env.local | xargs) && cd manager/service && ../.venv/bin/python manage.py runserver

# Run the Django tests
test-manager:
	@export $$(grep -v '^#' .env.local | xargs) && cd manager/service && ../.venv/bin/python manage.py test quizzes

# Run Django migrations
migrate-manager:
	@export $$(grep -v '^#' .env.local | xargs) && cd manager/service && ../.venv/bin/python manage.py migrate

# Create a Django superuser
createsuperuser-manager:
	@export $$(grep -v '^#' .env.local | xargs) && cd manager/service && ../.venv/bin/python manage.py createsuperuser
