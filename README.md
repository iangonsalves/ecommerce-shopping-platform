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
│   └── routes/
│       └── api.php
│
└── frontend/               # React frontend
    ├── src/
    │   ├── components/    # Reusable components
    │   │   ├── common/    # Common UI components
    │   │   │   ├── AlertMessage.jsx
    │   │   │   └── LoadingButton.jsx
    │   │   ├── form/     # Form-specific components
    │   │   │   └── FormTextField.jsx
    │   │   └── layout/   # Layout components
    │   │       └── PageContainer.jsx
    │   ├── hooks/        # Custom React hooks
    │   │   └── useForm.js
    │   ├── features/     # Redux features/slices
    │   │   └── auth/
    │   │       └── authSlice.js
    │   ├── pages/        # Page components
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── services/     # API services
    │   │   └── api.js
    │   └── App.jsx
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
- ✅ Custom hooks for form handling
- ✅ Reusable component architecture:
  - Common components (AlertMessage, LoadingButton)
  - Form components (FormTextField)
  - Layout components (PageContainer)
- ✅ Authentication pages (Login/Register)
- ✅ Material-UI integration
- ✅ API service configuration

## Component Architecture

### Reusable Components
1. **Layout Components**
   - `PageContainer`: Wrapper for consistent page layout
   
2. **Common Components**
   - `AlertMessage`: Handles error and success messages
   - `LoadingButton`: Button with loading state
   
3. **Form Components**
   - `FormTextField`: Standardized form input fields

### Custom Hooks
- `useForm`: Manages form state and handling

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
  - Custom Hooks
  - Reusable Components
  - Axios
  - React Router
