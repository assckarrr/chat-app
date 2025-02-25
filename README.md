# Chat App

A real-time chat application built with Node.js, Express.js, MongoDB, and Socket.io, featuring authentication with JWT and role-based access control (RBAC).

## Features
- User authentication (Register/Login) with JWT
- Secure password hashing using bcrypt
- Real-time messaging with Socket.io
- Role-Based Access Control (Admin & User)
- Admin functionalities (User and Message Management)
- Protected API routes using authentication middleware
- Modular code structure for maintainability

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/chat-app.git
   cd chat-app
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables (`.env` file):
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```sh
   npm start
   ```

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Chat Routes (Protected)
- `POST /api/chat` - Send a message
- `GET /api/chat` - Get all messages

### Admin Routes (Protected, Admin Only)
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete a user
- `DELETE /api/admin/messages/:id` - Delete a message

## Deployment
This project can be deployed on platforms like Render, Replit, or Railway.

## License
MIT
