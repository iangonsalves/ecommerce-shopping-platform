# E-commerce Platform Frontend

React-based frontend for the e-commerce platform.

## Features

- User authentication (login/register)
- Product listing with search and filtering
- Category navigation
- Responsive design with Material-UI
- Form validation
- Error handling

## Components

### Layout Components
- PageContainer - Main layout wrapper
- Navbar - Navigation bar

### Common Components
- AlertMessage - Error and success messages
- LoadingButton - Button with loading state
- SearchBar - Product search and filtering

### Form Components
- FormTextField - Standardized form input

### Pages
- Login - User login
- Register - User registration
- ProductList - Product listing with search
- ProductDetail - Product details
- CategoryList - Category listing

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   │   ├── common/    # Common UI components
│   │   ├── form/      # Form components
│   │   └── layout/    # Layout components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── hooks/         # Custom React hooks
│   └── App.jsx        # Main application component
```

## Dependencies

- React 18
- Material-UI
- React Router
- Axios
- Vite

## Development

The development server will run at http://localhost:5173
