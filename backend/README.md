# E-commerce Platform Backend

Laravel-based REST API backend for the e-commerce platform.

## Features

### Authentication
- JWT-based authentication
- User registration and login
- Token refresh mechanism
- Protected routes

### Products
- Product CRUD operations
- Product categorization
- Product search and filtering
- Image handling

### Shopping Cart
- Cart management system
- Real-time quantity updates
- Price calculations
- Cart item validation

### Orders
- Order placement and processing
- Order history tracking
- Order status management
- Shipping information handling

### Categories
- Category management
- Product-category relationships
- Nested category support

## Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── ProductController.php
│   │   ├── CategoryController.php
│   │   ├── CartController.php
│   │   ├── OrderController.php
│   │   └── CheckoutController.php
│   ├── Middleware/
│   │   └── JwtMiddleware.php
│   └── Requests/
├── Models/
│   ├── User.php
│   ├── Product.php
│   ├── Category.php
│   ├── Cart.php
│   ├── CartItem.php
│   ├── Order.php
│   └── OrderItem.php
└── Services/
    └── CartService.php
```

## Database Structure

### Users
- id
- name
- email
- password
- timestamps

### Products
- id
- name
- description
- price
- image
- category_id
- timestamps

### Categories
- id
- name
- description
- timestamps

### Carts
- id
- user_id
- total
- timestamps

### Cart Items
- id
- cart_id
- product_id
- quantity
- price
- timestamps

### Orders
- id
- user_id
- total
- status
- shipping information
- payment status
- timestamps

### Order Items
- id
- order_id
- product_id
- product_name
- quantity
- price
- timestamps

## API Endpoints

### Authentication
```
POST   /api/register     - Register new user
POST   /api/login        - User login
POST   /api/logout       - User logout
GET    /api/user         - Get authenticated user
```

### Products
```
GET    /api/products           - List all products
GET    /api/products/{id}      - Get product details
GET    /api/products/search    - Search products
POST   /api/products           - Create product (admin)
PUT    /api/products/{id}      - Update product (admin)
DELETE /api/products/{id}      - Delete product (admin)
```

### Categories
```
GET    /api/categories         - List all categories
GET    /api/categories/{id}    - Get category details
POST   /api/categories         - Create category (admin)
PUT    /api/categories/{id}    - Update category (admin)
DELETE /api/categories/{id}    - Delete category (admin)
```

### Cart
```
GET    /api/cart              - Get user's cart
POST   /api/cart/items        - Add item to cart
PUT    /api/cart/items/{id}   - Update cart item quantity
DELETE /api/cart/items/{id}   - Remove item from cart
```

### Orders
```
GET    /api/orders       - Get user's order history
GET    /api/orders/{id}  - Get specific order details
POST   /api/checkout     - Place new order
```

## Development Setup

Install dependencies:
```bash
composer install
```

2. Configure environment:
```bash
cp .env.example .env
# Configure database credentials
# Configure Stripe keys
```

### Database Setup
```bash
php artisan migrate:fresh --seed
```

### Start Development Server
```bash
php artisan serve
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:
```
Authorization: Bearer <token>
```

## Error Handling

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Server Error

## Security

- JWT authentication required for protected routes
- Input validation on all endpoints
- CORS configuration
- Rate limiting on authentication endpoints
- SQL injection protection
- XSS protection
