# Street Photography API Documentation

## Overview

This document describes the REST API endpoints for communication between the web application (plugin) and the server. The API provides access to photograph data and related operations.

## Base URL

```text
https://your-server-domain.vercel.app/api
```

## Authentication

All API requests require authentication. Include the authorization header:

```text
Authorization: Bearer <your-jwt-token>
```

---

## Photographs API

### Get All Photographs

Retrieve a list of all photographs.

**Endpoint:** `GET /api/photographs`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "photograph_id_123",
      "title": "Street Scene Downtown",
      "photoUrl": "https://example.com/photos/street-scene.jpg",
      "description": "A bustling street scene in downtown area during golden hour",
      "author": "John Photographer",
      "position": {
        "type": "Point",
        "coordinates": [139.6438652726942, 35.79418736999594]
      }
    }
  ],
  "total": 1
}
```

**Response Schema:**

- `success` (boolean): Operation success status
- `data` (array): Array of photograph objects
- `total` (number): Total number of photographs

**Photograph Object Schema:**

- `id` (string): Unique identifier for the photograph
- `title` (string): Title of the photograph
- `photoUrl` (string): URL to the photograph image
- `description` (string): Detailed description of the photograph
- `author` (string): Name of the photographer
- `position` (object): Geographic location as GeoJSON Point geometry
  - `type` (string): Always "Point" for position data
  - `coordinates` (array): [longitude, latitude] coordinates

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

**Status Codes:**

- `200 OK`: Request successful
- `401 Unauthorized`: Invalid or missing authentication
- `500 Internal Server Error`: Server error occurred

---

### Create New Photograph

Create a new photograph record.

**Endpoint:** `POST /api/photographs`

**Request Body:**

```json
{
  "title": "New Street Photo",
  "photoUrl": "https://example.com/photos/new-photo.jpg",
  "description": "Description of the new photograph",
  "author": "Photographer Name",
  "position": {
    "type": "Point",
    "coordinates": [139.6438652726942, 35.79418736999594]
  }
}
```

**Request Schema:**

- `title` (string, required): Title of the photograph
- `photoUrl` (string, required): URL to the photograph image
- `description` (string, optional): Description of the photograph
- `author` (string, required): Name of the photographer
- `position` (object, required): Geographic location as GeoJSON Point
  - `type` (string): Must be "Point"
  - `coordinates` (array): [longitude, latitude] coordinates

**Success Response:**

```json
{
  "success": true,
  "data": {
    "id": "photograph_id_456",
    "title": "New Street Photo",
    "photoUrl": "https://example.com/photos/new-photo.jpg",
    "description": "Description of the new photograph",
    "author": "Photographer Name",
    "position": {
      "type": "Point",
      "coordinates": [139.6438652726942, 35.79418736999594]
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

**Status Codes:**

- `201 Created`: Photograph created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing authentication
- `500 Internal Server Error`: Server error occurred

---

### Upload Image Asset

Upload an image file and get a URL for use in photograph records.

**Endpoint:** `POST /api/assets/upload`

**Request:**

- Content-Type: `multipart/form-data`
- Form field: `image` (file)

**Supported File Types:**

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)

**File Size Limit:** 10MB

**Success Response:**

```json
{
  "success": true,
  "data": {
    "id": "asset_id_789",
    "url": "https://your-storage.com/uploads/2024/01/15/unique-filename.jpg",
    "filename": "street-photo.jpg",
    "size": 1024000,
    "mimeType": "image/jpeg",
    "uploadedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Only image files are allowed"
  }
}
```

**Error Codes:**

- `INVALID_FILE_TYPE`: File is not an image
- `FILE_TOO_LARGE`: File exceeds size limit
- `UPLOAD_FAILED`: File upload processing failed

**Status Codes:**

- `201 Created`: Image uploaded successfully
- `400 Bad Request`: Invalid file or request
- `401 Unauthorized`: Invalid or missing authentication
- `413 Payload Too Large`: File size exceeds limit
- `500 Internal Server Error`: Server error occurred
