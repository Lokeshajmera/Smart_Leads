# Smart Leads API Documentation

This document provides detailed information about the API endpoints available in the Smart Leads Dashboard.

## Base URL
`http://localhost:5000/api`

## Authentication
All endpoints except registration and login require a Bearer Token in the Authorization header.
`Authorization: Bearer <your_jwt_token>`

---

## 1. Authentication System

### Register User
*   **URL:** `/auth/register`
*   **Method:** `POST`
*   **Body:**
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123",
      "role": "admin" 
    }
    ```
*   **Success Response:** `201 Created` with user details and JWT token.

### Login User
*   **URL:** `/auth/login`
*   **Method:** `POST`
*   **Body:**
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```
*   **Success Response:** `200 OK` with user details and JWT token.

---

## 2. Leads Management

### Get All Leads
*   **URL:** `/leads`
*   **Method:** `GET`
*   **Query Parameters:**
    *   `page`: Page number (default: 1)
    *   `limit`: Records per page (default: 10)
    *   `search`: Search by name or email
    *   `status`: Filter by status (New, Contacted, Qualified, Lost)
    *   `source`: Filter by source (Website, Instagram, Referral)
    *   `sortBy`: Sort by (Latest, Oldest)
*   **Success Response:** `200 OK` with leads array and pagination metadata.

### Create Lead
*   **URL:** `/leads`
*   **Method:** `POST`
*   **Body:**
    ```json
    {
      "name": "Lead Name",
      "email": "lead@email.com",
      "status": "New",
      "source": "Website"
    }
    ```

### Update Lead
*   **URL:** `/leads/:id`
*   **Method:** `PUT`
*   **Body:** Any subset of lead fields.

### Delete Lead
*   **URL:** `/leads/:id`
*   **Method:** `DELETE`
*   **Authorization:** Required (Admin only)

### Export Leads (CSV)
*   **URL:** `/leads/export`
*   **Method:** `GET`
*   **Query Parameters:** Same as Get All Leads.
*   **Response:** File download (`leads.csv`).

---

## 3. User Management (Admin Only)

### Get All Users
*   **URL:** `/users`
*   **Method:** `GET`

### Update User Role
*   **URL:** `/users/:id/role`
*   **Method:** `PATCH`
*   **Body:** `{"role": "admin" | "sales"}`

### Delete User
*   **URL:** `/users/:id`
*   **Method:** `DELETE`

---

## Error Handling
The API uses standard HTTP status codes and returns a centralized error format:
```json
{
  "success": false,
  "error": "Error message description"
}
```
*   `400`: Bad Request (Validation failed)
*   `401`: Unauthorized (Missing or invalid token)
*   `403`: Forbidden (Insufficient permissions)
*   `404`: Not Found
*   `500`: Internal Server Error
