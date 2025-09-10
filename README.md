# POOOONG Gaming Platform:

## Overview

[**POOOONG**](https://ftranscendence.ddns.net:8080/) is a sophisticated social gaming platform built with React, featuring real-time multiplayer games, user authentication, social features, and competitive gameplay. The application employs a modern architecture with context-based state management, custom hooks, WebSocket connections for real-time data, and a modular component structure. The backend is powered by Django, providing a RESTful API, user authentication, and a WebSocket server for real-time communication. The application is styled with Tailwind CSS and custom CSS, and it is fully responsive and mobile-friendly. The project is containerized with Docker and uses a PostgreSQL database. [testing invitation]


## Quick Start

1. Clone and enter the project:
```bash
git clone https://github.com/zelhajou/ft_web_transcendence.git
cd ft_web_transcendence
```
<!--
2. Set up environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```
-->

2. Start development:
```bash
make init    # First time setup only when you first clone the project
make dev     # Start servers in development mode
```

## Access Points

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Admin Panel: http://localhost:8000/admin

## Common Commands

```bash
make              # Show help
make up           # Start containers
make down         # Stop containers
make logs         # View logs
make frontend     # Frontend shell
make backend      # Backend shell
make db           # Database shell
make migrate      # Run migrations
make superuser    # Create admin user
make clean        # Cleanup
```

## Project Structure
```
.
├── Makefile
├── docker-compose.yml
└── src/
    ├── backend/    # Django
    └── frontend/   # React + Vite
```
