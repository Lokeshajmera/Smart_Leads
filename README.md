# GigFlow - Smart Leads Dashboard

A professional full-stack Lead Management Dashboard built for the ServiceHive internship assignment. This project implements a clean architecture with the MERN stack and TypeScript to manage hiring/gig leads efficiently.

## 🚀 Hiring Workflow (Loom Demo Steps)
When recording your 2-minute Loom video, here is the recommended "Hiring Workflow" to demonstrate:
1.  **Registration & RBAC**: Register a new **Admin** account.
2.  **Lead Creation**: Create a new lead (e.g., "Rahul", Source: "Instagram", Status: "New").
3.  **Discovery & Search**: Use the **Debounced Search** to find "Rahul" and apply a **Source Filter**.
4.  **Qualification**: Open the lead details, click Edit, and change the status to **Qualified**.
5.  **Data Portability**: Click **Export CSV** to download the filtered list.
6.  **Dark Mode**: Seamlessly toggle the theme to show the premium UI in both modes.

## Features

- **Authentication System:** JWT-based user registration and login with protected routes.
- **Role-Based Access Control:** Admin users can manage and delete leads, while Sales users can only view and edit.
- **Leads Management (CRUD):** Create, update, view, and delete (Admin) leads.
- **User Management (Admin Only):** Admins can manage users, change roles, and delete accounts with a dedicated responsive UI.
- **Advanced Filtering & Search:** Filter by Status, Source, search by Name or Email (debounced), and sort by Latest/Oldest. Filters can be combined.
- **Pagination:** Backend pagination limiting to 10 records per page.
- **CSV Export:** Download all leads based on current filters into a CSV file.
- **Dark Mode Support:** Toggle between light and dark themes seamlessly.
- **Premium UI:** Responsive layout with hamburger menus, loading skeletons, and interactive modals.
- **Dockerized Setup:** Easily spin up the application using Docker Compose.
- **Detailed API Documentation:** See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for endpoint details.

## Tech Stack

- **Frontend:** React.js, TypeScript, Vite, TailwindCSS (v4), Axios, Lucide React, react-router-dom, usehooks-ts.
- **Backend:** Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, bcryptjs, Zod (Validation), json2csv.

## Setup Instructions

### Option 1: Docker Compose (Recommended)

Make sure you have [Docker](https://www.docker.com/) installed on your machine.

1. Clone the repository.
2. Navigate to the root directory.
3. Run the following command:
   ```bash
   docker-compose up --build
   ```
4. The frontend will be available at `http://localhost:5173`
5. The backend API will be available at `http://localhost:5000`

### Option 2: Local Development

#### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or a MongoDB URI)

#### Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Rename `.env.example` to `.env` and configure your `MONGO_URI` and `JWT_SECRET`.
4. Start the development server: `npm run dev`

#### Frontend Setup
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. The frontend will run on `http://localhost:5173`

## API Documentation

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and receive JWT

### Lead Routes (Requires Bearer Token)
- `GET /api/leads` - Get paginated leads. Accepts queries: `page`, `limit`, `search`, `status`, `source`, `sortBy`.
- `POST /api/leads` - Create a new lead.
- `GET /api/leads/:id` - Get a single lead by ID.
- `PUT /api/leads/:id` - Update a lead by ID.
- `DELETE /api/leads/:id` - Delete a lead by ID (Admin only).
- `GET /api/leads/export` - Export leads as CSV. Accepts same filter queries as `GET /api/leads`.

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart_leads
JWT_SECRET=your_jwt_secret_here
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

## 📧 Submission Details
- **To:** ritik.yadav@servicehive.tech
- **CC:** hr.recruitment@servicehive.tech
- **Subject:** MERN Internship Assignment Submission - [Your Name]

