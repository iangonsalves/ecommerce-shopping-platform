# E-Commerce Shopping Platform

A modern e-commerce platform built with Laravel (backend) and React (frontend).

## Project Structure

```
ecommerce-shopping-platform/
├── backend/                 # Laravel backend
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       └── AuthController.php
│   │   └── Models/
│   │       └── User.php
│   ├── database/
│   │   └── migrations/
│   │       └── 2024_03_19_000000_create_users_table.php
│   ├── routes/
│   │   └── api.php
│   └── .env
│
└── frontend/                # React frontend
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── store/
    │   │   └── authSlice.js
    │   ├── services/
    │   │   └── api.js
    │   └── App.jsx
    └── package.json
```

## Features Implemented (Week 1)

### Backend
- ✅ Laravel with Sanctum authentication
- ✅ User registration and login system
- ✅ Role-based access control (admin/customer)
- ✅ API endpoints for authentication
- ✅ Database migrations for users table

### Frontend
- ✅ React with Vite setup
- ✅ Redux state management
- ✅ Login and Register pages
- ✅ Material-UI components
- ✅ API service configuration

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout (protected)
- `GET /api/user` - Get current user data (protected)

## Getting Started

### Prerequisites
- PHP >= 8.1
- Composer
- Node.js >= 16
- npm
- MySQL

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   composer install
   ```

3. Copy .env.example to .env:
   ```bash
   cp .env.example .env
   ```

4. Generate application key:
   ```bash
   php artisan key:generate
   ```

5. Configure database in .env:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=your_database
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

6. Run migrations:
   ```bash
   php artisan migrate
   ```

7. Start the server:
   ```bash
   php artisan serve
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Testing
1. Backend server runs on: http://127.0.0.1:8000
2. Frontend server runs on: http://localhost:5173

## Next Steps (Week 2)
- Product catalog implementation
- Product listing page
- Product detail page
- Category management
- Search functionality

## Technologies Used
- Backend:
  - Laravel
  - Laravel Sanctum
  - MySQL
  - PHP 8.1+

- Frontend:
  - React
  - Redux Toolkit
  - Material-UI
  - Axios
  - React Router

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
This project is licensed under the MIT License. 