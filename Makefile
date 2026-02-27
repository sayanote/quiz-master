# Makefile for QuizMaster 2

.PHONY: run-manager test-manager help

# Default target
help:
	@echo "Available commands:"
	@echo "  make run-manager    - Start the Quiz Manager (Django) server"
	@echo "  make test-manager   - Run tests for the Quiz Manager"

# Run the Django server from the manager/service directory
run-manager:
	cd manager/service && ../.venv/bin/python manage.py runserver

# Run the Django tests
test-manager:
	cd manager/service && ../.venv/bin/python manage.py test quizzes
