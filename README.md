# Konovo Zadatak

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router v7** for routing
- **TanStack Query** for data fetching and caching
- **Tailwind CSS** for styling
- **Shadcn UI** for component library
- **Vite** for build tooling

### Backend
- **PHP 8+** 
- **Custom MVC Framework** (lightweight)
- **cURL** for external API communication
- **Composer** for dependency management

### External API
- **Base URL**: `https://zadatak.konovo.rs/`
- **Authentication**: JWT token-based
- **Products**: RESTful API for product data

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PHP** (v8.0 or higher)
- **Composer** (latest version)
- **XAMPP** or similar local server environment
- **Git** (for cloning the repository)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd zadatak-konovo
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Install PHP Dependencies
```bash
composer install
```

#### Configure Web Server
1. **For XAMPP**: Place the `backend` folder in your `htdocs` directory
2. **For other servers**: Configure your web server to point to the `backend` directory
3. **Ensure PHP has cURL extension enabled**

#### Test Backend
- Start your local server (XAMPP, Apache, etc.)
- Navigate to `http://localhost/zadatak-konovo/backend/`
- You should see a JSON response like {"message":"Not Found"} indicating the API is working

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd frontend
```

#### Install Node.js Dependencies
```bash
npm install
```

#### Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Configuration

#### Backend Configuration
The backend is pre-configured to work with the external API. No additional configuration is needed.

#### Frontend Configuration
The frontend is configured to connect to the backend at `http://localhost/zadatak-konovo/backend/`. If your backend is running on a different URL, update the axios configuration in `frontend/app/config/axios.config.ts`.

## 🔧 Development

### Available Scripts

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

#### Backend
```bash
composer install     # Install dependencies
composer dump-autoload # Regenerate autoloader
```

## 🔐 Authentication

### Test Credentials
- **Username**: `zadatak`
- **Password**: `zadatak`

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues
- **cURL not available**: Enable cURL extension in PHP
- **CORS errors**: Ensure proper CORS headers are set
- **404 errors**: Check web server configuration

#### Frontend Issues
- **Build errors**: Clear node_modules and reinstall dependencies
- **API connection**: Verify backend URL in axios config
- **Hydration warnings**: These are normal with browser extensions

### Debug Mode
- **Frontend**: Use browser dev tools and React DevTools
- **Backend**: Check PHP error logs and enable error reporting
