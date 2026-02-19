# 🛠 Do-It-List Backend API

Backend service for the Do-It-List application built with Node.js, Express 5, TypeScript, and MongoDB.

This API handles authentication, task management, password reset, email notifications, and secure user session handling.

## 📦 Tech Stack

- **Node.js**
- **Express 5**
- **TypeScript**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **bcryptjs (password hashing)**
- **Nodemailer (email service)**
- **Express Rate Limit**
- **Helmet**
- **Mongo Sanitization**
- **Cookie-based authentication**

## 🏗 Architecture Overview

The project follows a layered architecture:

```
Routes → Controllers → Models → Database
               ↓
            Services
               ↓
           Utilities
```

Key Principles:

- Separation of concerns
- Centralized error handling
- Middleware-based security
- Type-safe development with TypeScript
- Clean and maintainable structure

For frontend client, please visit [here](https://github.com/jhzrmx/do-it-list-frontend).

## 📂 Folder Structure

```
src/
│
├── index.ts                     # App entry point
│
├── api/                         # API-specific setup (if extended)
│
├── controllers/                 # Business logic
│   ├── auth.controller.ts
│   ├── todo.controller.ts
│   ├── password-reset.controller.ts
│   ├── me.controller.ts
│   └── index.ts
│
├── db/
│   └── db.connect.ts            # MongoDB connection setup
│
├── middlewares/
│   ├── auth.middleware.ts
│   ├── global-error-handler.middleware.ts
│   └── limiter.middleware.ts
│
├── models/
│   ├── user.model.ts
│   ├── todo.model.ts
│   └── password-reset.model.ts
│
├── routes/
│   ├── auth.routes.ts
│   ├── todo.routes.ts
│   ├── password-reset.routes.ts
│   ├── me.routes.ts
│   └── index.ts
│
├── services/
│   └── email.service.ts
│
├── types/
│   └── express.d.ts             # Custom Express typings
│
└── utils/
    ├── generate-token.ts
    ├── mongo-sanitizer.ts
    ├── validate-password.ts
    └── error/
        └── app-error.util.ts
```

## 🚀 Getting Started

1. Clone the Repository

```
git clone https://github.com/jhzrmx/do-it-list-backend
```

2. Navigate into project

```
cd do-it-list-backend
```

3. Install Dependencies

```
npm install
```

4. Configure Environment Variables

- Create a `.env` file based on `.env.example`.

5. Run Development Server

```
npm run dev
```

Type-check only:

```
npm run typecheck
```

## 🔐 Authentication Flow

- User registers
- Password is hashed using bcryptjs
- JWT token is generated
- Token is sent via HTTP-only cookie
- Protected routes verify JWT via middleware
- Protected Route Flow:

```
Request → auth.middleware → Controller → Response
```

## 📌 API Endpoints Overview

**🔑 Auth Routes**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |

**👤 User Route (Protected)**
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/me` | Get current user profile |
| PUT | `/api/me` | Update current user profile |
| DELETE | `/api/me` | Delete current user profile |

**📝 Todo Routes (Protected)**
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/todos` | Get user todos (with limit/cursor) |
| POST | `/api/todos` | Create new todo |
| PUT | `/api/todos/:id` | Update todo |
| DELETE | `/api/todos/:id` | Delete todo |

**🔄 Password Reset**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/forget-password/send-link` | Request reset email |
| POST | `/api/forget-password/verify-link` | Verifies if link sent was valid |
| POST | `/api/forget-password/change-password` | User changes their password, given the token |

## 🛡 Security Features

- Helmet for secure HTTP headers
- Express rate limiting
- Mongo query sanitization
- Password hashing with bcrypt
- JWT authentication
- HTTP-only cookies
- Centralized error handling
- Input validation (controller-level)

## 🧠 Error Handling Strategy

All errors are handled by:

```
global-error-handler.middleware.ts
```

Custom AppError utility is used for:

- Consistent error structure
- Proper HTTP status codes
- Clean production-ready responses

Example response:

```
STATUS CODE: 400
{
  "message": "Wrong password"
}
```

## 📧 Email Service

The email.service.ts handles:

- Password reset emails
- SMTP configuration
- Secure token-based reset flow

## 🗄 Database

- **MongoDB** with Mongoose ODM
- Indexed schemas
- Timestamps enabled
- Schema-level validations

## 🧩 TypeScript Integration

- Custom Express Request typing
- Strict type checking
- Clear interface definitions for models

## 🤝 Contributing

- Fork the repository
- Create feature branch
- Follow conventional commits
- Submit pull request