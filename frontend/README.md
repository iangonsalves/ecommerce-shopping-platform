# E-commerce Platform Frontend

React-based frontend application for the e-commerce platform.

## Features

### Core Features
- User authentication (login/register)
- Product browsing and search
- Category navigation
- Shopping cart management
- Order history tracking
- Responsive design

### Components
- **Layout**: Navbar, Footer, PageContainer
- **Products**: ProductList, ProductDetail, SearchBar
- **Cart**: CartIcon, Cart, CartItem
- **Orders**: OrderHistory, OrderSuccess
- **Auth**: Login, Register, ProtectedRoute

### State Management
- AuthContext for user authentication
- CartContext for shopping cart
- Real-time cart updates

## Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── CartIcon.jsx
│   │   └── SearchBar.jsx
│   └── layout/
│       ├── Navbar.jsx
│       └── Footer.jsx
├── context/
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── pages/
│   ├── Cart.jsx
│   ├── ProductList.jsx
│   ├── ProductDetail.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── OrderHistory.jsx
│   └── OrderSuccess.jsx
└── App.jsx
```

## Main Dependencies

- React 18
- Material-UI
- React Router
- Axios

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Set API_URL=http://localhost:8000/api
```

3. Start development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview build

## Key Features Implementation

### Authentication
- JWT-based auth flow
- Protected routes
- Persistent sessions

### Shopping Cart
- Real-time updates
- Quantity management
- Price calculations

### Product Display
- Grid layout
- Search functionality
- Category filtering

### Styling
- Material-UI components
- Responsive design
- Custom theme
