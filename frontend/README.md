# Alex's Jersey Hub Platform Frontend

React-based frontend application for Alex's Jersey Hub Platform.

## Features

### Core Features
- User authentication (login/register)
- Product browsing and search
- League and club navigation (nested categories)
- Shopping cart management
- Order history tracking
- Responsive design

### Admin Features
- Product Management: shows both club and league for each product
- Category Management: set parent (league) for each club, display league names
- Add/edit products: select a club (with league shown in parentheses)
- Category dropdown in Product Management only shows clubs, grouped by league context

### Components
- **Layout**: Navbar, Footer, PageContainer
- **Products**: ProductList, ProductDetail, SearchBar
- **Cart**: CartIcon, Cart, CartItem
- **Orders**: OrderHistory, OrderSuccess
- **Auth**: Login, Register, ProtectedRoute
- **Admin**: ProductManagement, CategoryManagement, UserManagement, OrderManagement, ReviewManagement

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
│   ├── OrderSuccess.jsx
│   └── admin/
│       ├── ProductManagement.jsx
│       ├── CategoryManagement.jsx
│       ├── UserManagement.jsx
│       ├── OrderManagement.jsx
│       └── ReviewManagement.jsx
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
# Set VITE_API_BASE_URL=http://localhost:8000
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
- League and club filtering (nested categories)

### Admin Management
- Product Management: assign products to clubs, see league context
- Category Management: set parent league for clubs, see league names
- Category dropdown in Product Management only shows clubs, grouped by league

### Styling
- Material-UI components
- Responsive design
- Custom theme
