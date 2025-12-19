.PHONY: help install backend frontend all dev stop clean db-migrate db-reset check-ports

help:
	@echo "Available commands:"
	@echo "  make install      - Install dependencies for both backend and frontend"
	@echo "  make backend      - Run backend server (port 3000)"
	@echo "  make frontend     - Run frontend dev server (port 5173)"
	@echo "  make all          - Run both backend and frontend concurrently"
	@echo "  make dev          - Alias for 'make all'"
	@echo "  make stop         - Stop all running services"
	@echo "  make clean        - Clean node_modules and build artifacts"
	@echo "  make db-migrate   - Run database migrations"
	@echo "  make db-reset     - Reset database and run migrations"
	@echo "  make check-ports  - Check if ports 3000 and 5173 are available"

install:
	@echo "📦 Installing backend dependencies..."
	cd backend && npm install
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install
	@echo "✅ Dependencies installed successfully"

backend:
	@echo "🚀 Starting backend server on port 3000..."
	cd backend && npm run start:dev

frontend:
	@echo "🚀 Starting frontend dev server on port 5173..."
	cd frontend && npm run dev

all:
	@echo "🚀 Starting all services..."
	@make -j2 backend frontend

dev: all

stop:
	@echo "🛑 Stopping all services..."
	@lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "Backend not running"
	@lsof -ti:5173 | xargs kill -9 2>/dev/null || echo "Frontend not running"
	@echo "✅ All services stopped"

clean:
	@echo "🧹 Cleaning node_modules and build artifacts..."
	rm -rf backend/node_modules backend/dist
	rm -rf frontend/node_modules frontend/dist
	@echo "✅ Cleaned successfully"

db-migrate:
	@echo "🗄️  Running database migrations..."
	cd backend && npx tsx database/migrate.ts
	@echo "✅ Migrations completed"

db-reset:
	@echo "🗄️  Resetting database..."
	rm -f backend/data/app.db
	@make db-migrate
	@echo "✅ Database reset completed"

check-ports:
	@echo "🔍 Checking ports..."
	@lsof -ti:3000 >/dev/null 2>&1 && echo "⚠️  Port 3000 is in use" || echo "✅ Port 3000 is available"
	@lsof -ti:5173 >/dev/null 2>&1 && echo "⚠️  Port 5173 is in use" || echo "✅ Port 5173 is available"
