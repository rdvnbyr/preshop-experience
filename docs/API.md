# API Documentation

Base URL: `http://localhost:4000`

## Authentication Endpoints

### Register User

**POST** `/api/auth/register`

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-10-02T13:00:00.000Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User

**POST** `/api/auth/login`

**Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User

**GET** `/api/auth/me`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-10-02T13:00:00.000Z",
    "updatedAt": "2024-10-02T13:00:00.000Z"
  }
}
```

## User Endpoints (Protected)

All user endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

### Get All Users

**GET** `/api/users`

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-10-02T13:00:00.000Z",
      "updatedAt": "2024-10-02T13:00:00.000Z"
    }
  ]
}
```

### Get Single User

**GET** `/api/users/:id`

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-10-02T13:00:00.000Z",
    "updatedAt": "2024-10-02T13:00:00.000Z"
  }
}
```

### Update User

**PUT** `/api/users/:id`

**Body:**

```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Updated",
    "email": "johnupdated@example.com",
    "createdAt": "2024-10-02T13:00:00.000Z",
    "updatedAt": "2024-10-02T14:00:00.000Z"
  }
}
```

### Delete User

**DELETE** `/api/users/:id`

**Response:**

```json
{
  "success": true,
  "data": {},
  "message": "User deleted successfully"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "User already exists"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "User not found"
}
```

### 500 Server Error

```json
{
  "success": false,
  "message": "Server error"
}
```
