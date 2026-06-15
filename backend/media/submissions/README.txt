# TaskSync - Professional Team Task Manager

TaskSync is a high-fidelity, professional-grade task management platform designed for modern development teams. It features a sleek cyber-workspace aesthetic with robust role-based access control and real-time task synchronization.

## 📁 Project Architecture

The project is organized using a clean, professional monorepo-style structure:

```text
edunettask/
├── frontend/               # Frontend Client (Vanilla JS + Tailwind)
│   ├── assets/            # Static assets and icons
│   ├── css/               # External stylesheets
│   └── js/                # Application logic and API service
├── backend/                # Backend API (Node.js + Express + Sequelize)
│   ├── src/               # Source code
│   │   ├── config/        # Database and environment config
│   │   ├── controllers/   # Business logic / Route handlers
│   │   ├── middleware/    # Security and Role-Based Access (RBAC)
│   │   ├── models/        # Sequelize Data Models
│   │   ├── routes/        # API Endpoints
│   │   └── utils/         # Data Seeders and utilities
│   └── server.js          # Entry point
└── README.md              # Project documentation
```

## 🚀 Key Features

- **Cyber-Workspace UI**: High-end glassmorphism design with neon accents and fluid animations.
- **Role-Based Access Control (RBAC)**: Secure permission layers for Admins and Team Members.
- **Smart Workflow**: Automated navigation and data pre-filling for a seamless user experience.
- **Persistence Layer**: Automated data seeding ensures the platform is never empty after a fresh deploy.
- **Responsive Design**: Fully optimized for both desktop and mobile views.

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS, FontAwesome.
- **Backend**: Node.js, Express.js.
- **Database**: SQLite (managed via Sequelize ORM).
- **Authentication**: JSON Web Tokens (JWT) with Bcrypt password hashing.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
