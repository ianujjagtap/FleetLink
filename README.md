# FleetLink - Logistics Vehicle Booking System

## Tech Stack
- **Frontend**: ReactJS (with Next.js)
- **Backend**: Node.js
- **Database**: MongoDB (Atlas or local)
- **Testing**: Jest
- **Containerization**: Docker (with docker-compose)

## Installation

### Prerequisites
- **Node.js**: v18 or higher (recommended for local development)
- **pnpm**: Install globally with `npm install -g pnpm`
- **Docker**: Install Docker and Docker Compose for containerized setup
- **MongoDB Atlas**: A free-tier account (or local MongoDB instance)
- **Git**: To clone the repository

### Step 1: Clone the Repository
```bash
git clone https://github.com/<your-username>/fleetlink.git
cd fleetlink

```
### Step 2: Configure Environment Variables
```bash
MONGODB_URL= <Mongodb connection string>
```

### Step 3: Install Dependencies (Optional - Local Development)
``` bash 
pnpm install 
```

### Step 3: Start the application
``` bash 
docker-compose up --build
```
### Option 2: Local Development
``` bash 
pnpm run dev
```
### Step 5: Verify Installation
- Open your browser and navigate to http://localhost:3000.
- Test the "Add Vehicle" and "Search & Book" pages to ensure functionality.

## Project Structure

```bash
/project-root
    /src
        /app                  # Contains all routes and pages
        /app/api              # Next.js pages and API routes (e.g., api/vehicles, api/bookings).
        /components           # Contains reusable components
        /primitives           # Contains primitive components or base UI elements
        /hooks                # Custom hooks for the app
        /interfaces           # TypeScript interfaces for the app
        /lib                  # Helper functions, utilities, and configuration files
        /providers            # Context and providers for app-wide state management
    /public                   # Static assets and images
    /styles                   # Global styles, TailwindCSS theme configuration
    /tests                    # Unit and integration tests
    /config                   # Project configuration files (e.g., Next.js config, environment settings)
    next.config.ts             # Next.js settings
    .gitignore                 # Specifies files to ignore in Git
    . dockerignore             # Specifies files to ignore in Docker
    . jest-config.js           # Jest configuration file 
    dockerfile                 # Main dockerFile
    README.md                  # Project documentation
    package.json               # Project metadata and dependencies
```
### Notes :
- Containerization using docker 
- delete API with integration for DELETE booking 

### Notes :
- For the ride duration calculation placdeholder formula is used 
- API routes ( Backend API ) can be found in /app/api dir
- Deployment can be found on https://fleet-link-sand.vercel.app/dashboard/vehicle-management

### Thank You Knovator for this opportunity of building FleetLink , Looking forward for feedback ! 

