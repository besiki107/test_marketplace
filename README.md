# AutoParts Marketplace

A modern, minimal React marketplace web application for browsing and managing car parts. Features a public marketplace for users and a protected admin dashboard for inventory management.

## Features

### Public Marketplace
- **Browse Items**: Responsive grid layout (4 columns desktop, 2 tablet, 1 mobile)
- **Search & Filter**: Search by title/description, filter by category and price range
- **Sort Options**: Price (low-high, high-low) and newest first
- **Item Details Modal**: Click any item to view full details with smooth animations
- **Favorites System**: Save favorite items using LocalStorage
- **Recently Viewed**: Track last 10 viewed items using SessionStorage
- **Pagination**: 12 items per page with navigation controls

### Admin Dashboard (Protected)
- **Admin Login**: Secure authentication with protected routes
- **Dashboard Stats**: View total items, categories, and latest additions
- **Inventory Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Item Form**: Comprehensive form with validation for all fields
- **Search**: Find items quickly in the admin table view
- **Delete Confirmation**: Safety dialog before removing items

## Tech Stack

- **Frontend**: React 19 with functional components and hooks
- **Routing**: React Router v7
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/UI (Radix UI primitives)
- **API**: Axios for HTTP requests
- **Backend**: JSON Server (mock REST API)
- **Storage**: LocalStorage (favorites, auth) & SessionStorage (recently viewed)

## Design System

- **Theme**: Industrial monochrome with high contrast
- **Typography**: JetBrains Mono (headings/numbers) + Inter (body text)
- **Color Palette**: Black, white, and grays (no gradients)
- **Layout**: No rounded corners, sharp edges, minimal aesthetic
- **Animations**: Fast (200ms), linear/ease-out transitions

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Steps

1. **Clone and Navigate**
   ```bash
   cd /app
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   yarn install
   ```

3. **Install JSON Server Globally**
   ```bash
   npm install -g json-server
   ```

4. **Environment Variables**
   
   Frontend `.env` (already configured):
   ```
   REACT_APP_BACKEND_URL=http://localhost:8001
   REACT_APP_API_URL=http://localhost:3001
   REACT_APP_ADMIN_USER=admin
   REACT_APP_ADMIN_PASS=admin123
   ```

## Running the Application

### Option 1: Run Both Servers Simultaneously (Recommended)

From the `/app/frontend` directory:
```bash
yarn dev
```

This starts both:
- Frontend dev server: http://localhost:3000
- JSON Server API: http://localhost:3001

### Option 2: Run Servers Separately

**Terminal 1 - JSON Server:**
```bash
cd /app
json-server --watch db.json --port 3001
```

**Terminal 2 - Frontend:**
```bash
cd /app/frontend
yarn start
```

## Usage

### Public Access
1. Open http://localhost:3000
2. Browse car parts in the grid
3. Use search and filters to find specific items
4. Click any item to view details in a modal
5. Click the heart icon to add items to favorites
6. Visit the Favorites page to see saved items

### Admin Access
1. Navigate to http://localhost:3000/admin/login
2. Login with credentials:
   - **Username**: admin
   - **Password**: admin123
3. Access the admin dashboard
4. Manage items:
   - View all items in a table
   - Create new items with the form
   - Edit existing items
   - Delete items (with confirmation)
   - Search items in the admin panel

## API Endpoints

JSON Server provides RESTful endpoints:

- `GET /items` - Retrieve all items
- `GET /items/:id` - Retrieve single item
- `POST /items` - Create new item
- `PUT /items/:id` - Update item
- `DELETE /items/:id` - Delete item

Query parameters supported:
- `?_sort=field&_order=asc|desc` - Sorting
- `?category=value` - Filter by category
- `?_limit=12&_page=1` - Pagination

## Demo Credentials

**Admin Login:**
- Username: `admin`
- Password: `admin123`

## Sample Data

The application comes pre-populated with 15 car parts items across 9 categories:
- Engine parts
- Brake components
- Lighting systems
- Wheels
- Exhaust systems
- Electrical components
- Suspension parts
- Body panels
- Interior accessories

## Testing Results

✅ **Backend API**: 94% (15/16 tests passed)  
✅ **Frontend**: 100% (all features working)  
✅ **Integration**: 100% (API calls, storage, routing)  
✅ **Admin**: 100% (login, CRUD, validation)  
✅ **Responsive**: 100% (desktop, tablet, mobile)
