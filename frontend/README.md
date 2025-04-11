# E-Commerce Platform Frontend

React-based frontend for the e-commerce platform.

## Directory Structure
```
frontend/
├── src/
│   ├── components/              # Reusable components
│   │   ├── common/             # Common UI components
│   │   │   ├── AlertMessage/   # Alert notifications
│   │   │   │   └── index.jsx   # Success/Error messages
│   │   │   └── LoadingButton/  # Button with loading state
│   │   │       └── index.jsx
│   │   ├── form/              # Form-specific components
│   │   │   └── FormTextField/ # Standardized text input
│   │   │       └── index.jsx
│   │   └── layout/            # Layout components
│   │       └── PageContainer/ # Standard page wrapper
│   │           └── index.jsx
│   ├── hooks/                 # Custom React hooks
│   │   └── useForm.js        # Form state management
│   ├── features/             # Redux features/slices
│   │   └── auth/            # Authentication feature
│   │       └── authSlice.js # Auth state management
│   ├── pages/               # Page components
│   │   ├── Login.jsx       # Login page
│   │   └── Register.jsx    # Registration page
│   ├── services/           # API services
│   │   └── api.js         # Axios configuration
│   └── App.jsx            # Main app component
```

## Components

### Common Components
1. **AlertMessage**
   - Purpose: Display success/error messages
   - Props:
     - `message`: Message content
     - `severity`: 'error' | 'success'
     - `onClose`: Close handler

2. **LoadingButton**
   - Purpose: Button with loading state
   - Props:
     - `loading`: Boolean
     - `loadingText`: Text to show while loading
     - `children`: Button content

### Form Components
1. **FormTextField**
   - Purpose: Standardized form input
   - Props:
     - `name`: Field name
     - `label`: Field label
     - `type`: Input type
     - `value`: Field value
     - `onChange`: Change handler

### Layout Components
1. **PageContainer**
   - Purpose: Consistent page layout
   - Props:
     - `children`: Page content
     - `maxWidth`: Container width

## Custom Hooks

### useForm
- Purpose: Manage form state and handling
- Features:
  - Form data management
  - Input change handling
  - Form reset functionality
- Usage:
  ```jsx
  const { formData, handleChange, resetForm } = useForm({
    email: '',
    password: ''
  });
  ```

## State Management
- Redux Toolkit for state management
- Features:
  - Authentication state
  - Loading states
  - Error handling
  - Success messages

## API Integration
- Axios for API requests
- Features:
  - Base URL configuration
  - Auth token handling
  - Error interceptors
  - Response handling

## Available Scripts
- `npm install`: Install dependencies
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Development
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open http://localhost:5173
3. Make changes in `src/`
4. See real-time updates in browser

## Dependencies
- React 18+
- Material-UI
- Redux Toolkit
- React Router
- Axios
