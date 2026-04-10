# Expense Manager

Learning product development lifecycle by developing an Expense Manager similar to Splitwise. This project is built as an interactive CLI application using TypeScript, Node.js, and a containerized MySQL database environment.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Docker Orchestration](#docker-orchestration)
- [Database Management](#database-management)
- [Usage](#usage)
- [Security](#security)
- [Project Roadmap](#project-roadmap)

---

## 🌟 Overview
The **Expense Manager** is a prototype application designed to settle payments and track debts between individual users. It focuses on the end-to-end product development journey, moving from local file-based storage to a robust, containerized SQL database architecture.

## ✨ Features
The application is currently focused on the **Connection Module**, providing the following functionality:

- **Add Friend**: Supports adding friends with Name, Email, and Phone Number.
- **Search Friend**: Search capabilities via Name, Email, or Phone Number.
- **Remove Friend**: Logic to remove friends only after their balance is settled (must be 0).
- **Update Friend Info**: Modify existing friend details.
- **Balance Tracking**: Tracks opening balances where positive values indicate they owe you and negative values indicate you owe them.

## 🛠 Tech Stack
- **Language**: TypeScript (ESNext)
- **Runtime**: Node.js (ES Modules)
- **Database**: MySQL 8.0
- **Infrastructure**: Docker & Docker Compose
- **Database Management**: phpMyAdmin

## 🏗 Architecture
The project follows a clean, layered architecture to separate concerns:

- **Presentation Layer (`src/presentation`)**: Handles user interaction via an asynchronous CLI manager
- **Controller Layer (`src/controller`)**: Acts as a bridge between the user interface and the data logic
- **Repository Layer (`src/repositories`)**: Manages data persistence and executes SQL queries
- **Core Layer (`src/core`)**: Contains database initialization, common types, and input validators (email, phone, number)
- **Models (`src/models`)**: Defines data structures like the `iFriend` interface

## ⚙️ Prerequisites
- Windows Subsystem for Linux (WSL 2)
- Docker Desktop or Docker Engine installed on WSL 2
- Node.js 20+ (if running locally)

## 🚀 Setup & Installation

### 1. Clone the Project
```bash
git clone <repository-url>
cd expense-manager
```

## Configure Environment Variables
Create a .env file in the root directory to store sensitive database credentials.
```plaintext
DB_HOST=db
DB_USER=user
DB_PASSWORD=password
DB_NAME=expense_mgr
MYSQL_ROOT_PASSWORD=rootpassword
```

## Build the Docker Image
The project utilizes a multi-stage Dockerfile to compile TypeScript into a lean production image.
```bash
docker compose build
```

## 🐳 Docker Orchestration
Manage the services and run the app using Docker Compose.
- Start background services (MySQL & phpMyAdmin):
```bash
docker compose up -d
```
- Run the interactive CLI app:
```bash
docker compose run --rm app
```
- Shut down and wipe data volumes (Clean Reset):
```bash
docker compose down -v
```

## ⌨️ Usage
Upon launching the app, use the numeric menu to navigate:
1. **Add Friend**: Enter name, email, phone, and opening balance.
2. **Search Friend**: Search by specific attributes or "Show all" to see a formatted table.
3. **Exit**: Choice 5 gracefully closes the CLI interface and the MySQL connection pool.

## 🗄 Database Management
Manage your MySQL tables via the integrated phpMyAdmin service.
- URL: http://localhost:8080
- Server: db
- Username/Password: Defined in your .env file.

## 🔒 Security
Environment Isolation: Sensitive credentials are never hardcoded and are injected at runtime.
- **Source Protection**: The multi-stage build ensures only compiled JavaScript is present in the final image.
- **Input Validation**: Strict validators are applied to emails and phone numbers before they reach the database.

## 🗺 Project Roadmap
- Phase 1 (Complete): Robust business logic and local mock storage.
- Phase 2 (In Progress): Migration to a hosted SQL Database and containerization.
- Phase 3 (Future): Group Management Module and complex splitting logic (percentage/shares).
- Phase 4 (Future): Development of a user-friendly GUI.
