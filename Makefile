# Variables
DOCKER_COMPOSE = $(shell if [ -x "$$(command -v docker)" ] && docker compose version >/dev/null 2>&1; then echo "docker compose"; elif command -v docker-compose >/dev/null 2>&1; then echo "docker-compose"; else echo ""; fi)
DOCKER_COMPOSE_FILE = docker-compose.yml

# Git submodule paths
FRONTEND_SUBMODULE = src/frontend
BACKEND_SUBMODULE = src/backend

# Environment Files
ENV_FILE = .env
ENV_EXAMPLE = .env.example

# Colors
GREEN = \033[0;32m
RED = \033[0;31m
YELLOW = \033[0;33m
BLUE = \033[0;34m
PURPLE = \033[0;35m
NC = \033[0m # No Color

# Default target
.DEFAULT_GOAL := help

# Help target
help:
	@echo "$(GREEN)Available commands:$(NC)"
	@echo "$(YELLOW)Project Setup:$(NC)"
	@echo "  make init          - Initialize project (submodules and environment)"
	@echo "  make update        - Update all submodules to latest main branch"
	@echo "  make setup-env     - Copy example env file and prompt for values"
	@echo "$(YELLOW)Docker Commands:$(NC)"
	@echo "  make build         - Build all containers"
	@echo "  make up           - Start all containers"
	@echo "  make down         - Stop and remove all containers"
	@echo "  make restart      - Restart all containers"
	@echo "  make logs         - View logs from all containers"
	@echo "  make ps           - Show running containers"
	@echo "  make install      - Install dependencies in containers"
	@echo "$(YELLOW)Development Commands:$(NC)"
	@echo "  make frontend     - Access frontend container shell"
	@echo "  make backend      - Access backend container shell"
	@echo "  make db          - Access database container shell"
	@echo "  make dev         - Start development environment"
	@echo "$(YELLOW)Database Commands:$(NC)"
	@echo "  make migrate      - Run database migrations"
	@echo "  make migrations   - Create new migrations"
	@echo "  make superuser    - Create a superuser for Django admin"
	@echo "  make backup       - Create database backup"
	@echo "  make restore      - Restore database from backup"
	@echo "$(YELLOW)Cleanup Commands:$(NC)"
	@echo "  make clean        - Remove all containers, volumes, and images"
	@echo "  make clean-all    - Remove all containers, volumes, and images (including unused)"
	@echo "  make reset        - Reset project to initial state"

# Project initialization
init:
	@echo "$(BLUE)Initializing project...$(NC)"
	@git submodule init
	@git submodule update --recursive
	@cd $(FRONTEND_SUBMODULE) && git checkout main && git pull
	@cd $(BACKEND_SUBMODULE) && git checkout main && git pull
	@make setup-env
	@make build
	@make install
	@echo "$(GREEN)Project initialized successfully!$(NC)"

# Environment setup
setup-env:
	@if [ ! -f $(ENV_FILE) ]; then \
		if [ -f $(ENV_EXAMPLE) ]; then \
			cp $(ENV_EXAMPLE) $(ENV_FILE); \
			echo "$(YELLOW)Please fill in the environment variables in $(ENV_FILE)$(NC)"; \
		else \
			echo "$(RED)Error: $(ENV_EXAMPLE) not found$(NC)"; \
			exit 1; \
		fi \
	else \
		echo "$(YELLOW)$(ENV_FILE) already exists. Skipping...$(NC)"; \
	fi

# Update submodules
update:
	@echo "$(BLUE)Updating submodules...$(NC)"
	@git submodule update --remote --merge
	@cd $(FRONTEND_SUBMODULE) && git checkout main && git pull
	@cd $(BACKEND_SUBMODULE) && git checkout main && git pull
	@make build
	@make install

# Install dependencies in containers
install:
	@echo "$(BLUE)Installing dependencies in containers...$(NC)"
	@if [ "$$($(DOCKER_COMPOSE) ps -q frontend 2>/dev/null)" = "" ]; then \
		echo "$(YELLOW)Starting containers temporarily...$(NC)"; \
		$(DOCKER_COMPOSE) up -d; \
	fi
	@echo "$(BLUE)Installing frontend dependencies...$(NC)"
	@$(DOCKER_COMPOSE) exec -T frontend npm install
	@echo "$(BLUE)Installing backend dependencies...$(NC)"
	@$(DOCKER_COMPOSE) exec -T backend pip install -r requirements.txt
	@echo "$(GREEN)Dependencies installed successfully!$(NC)"

# Docker commands
build:
	@echo "$(BLUE)Building containers...$(NC)"
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) build

up:
	@echo "$(GREEN)Starting containers...$(NC)"
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up -d

down:
	@echo "$(RED)Stopping containers...$(NC)"
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down

restart: down up

ps:
	@echo "$(BLUE)Running containers:$(NC)"
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) ps

# Logs
logs:
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) logs -f

# Development environment
dev: up
	@echo "$(GREEN)Development environment is ready!$(NC)"
	@echo "$(BLUE)Frontend running on: http://$(VITE_IP_ADDRESS):3000$(NC)"
	@echo "$(BLUE)Backend running on: http://$(VITE_IP_ADDRESS):8000$(NC)"

# Container access
frontend:
	@echo "$(GREEN)Accessing frontend container...$(NC)"
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) exec frontend /bin/sh

backend:
	@echo "$(GREEN)Accessing backend container...$(NC)"
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) exec backend /bin/bash

db:
	@echo "$(GREEN)Accessing database container...$(NC)"
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) exec db psql -U user -d transcendence

# Database operations
migrate:
	@echo "$(GREEN)Running database migrations...$(NC)"
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) exec backend python manage.py migrate

migrations:
	@echo "$(GREEN)Creating new migrations...$(NC)"
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) exec backend python manage.py makemigrations authentication notifications friendships game tournament chat background_task

superuser:
	@echo "$(GREEN)Creating superuser...$(NC)"
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) exec backend python manage.py createsuperuser

backup:
	@mkdir -p backup
	@echo "$(GREEN)Creating database backup...$(NC)"
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) exec db pg_dump -U user transcendence > backup/db_$(shell date +%Y%m%d_%H%M%S).sql

restore:
	@echo "$(YELLOW)Warning: This will overwrite the current database.$(NC)"
	@read -p "Enter backup file name from backup/ directory: " file; \
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) exec -T db psql -U user transcendence < backup/$$file

# Cleanup
clean:
	@echo "$(RED)Cleaning up containers, volumes, and images...$(NC)"
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down -v --rmi all

clean-all:
	@echo "$(RED)Cleaning up all containers, volumes, and images...$(NC)"
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down -v --rmi all
	@docker system prune -af

reset: clean
	@echo "$(RED)Resetting project to initial state...$(NC)"
	@git submodule deinit -f .
	@git submodule update --init
	@make init
	@echo "$(GREEN)Project reset successfully!$(NC)"

# Prevent commands from being interpreted as files
.PHONY: help init update install setup-env build up down restart ps logs dev \
	frontend backend db migrate migrations superuser backup restore clean reset
