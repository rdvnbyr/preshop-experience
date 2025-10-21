# Places & Reviews API Documentation

## Place Model Structure

```javascript
{
  title: String,              // Required, max 100 chars
  image: {
    src: String,             // Required
    alt: String,             // Optional
    thumbnail: String        // Optional
  },
  longitude: Number,          // Required, -180 to 180
  latitude: Number,           // Required, -90 to 90
  summary: String,            // Required, max 1000 chars
  tags: [String],            // Array of strings
  reviews: [ReviewId],       // Array of Review references
  createdBy: UserId,         // User reference
  averageRating: Number,     // Auto-calculated, 0-5
  reviewCount: Number,       // Auto-calculated
  createdAt: Date,           // Auto-generated
  updatedAt: Date            // Auto-generated
}
```

## Review Model Structure

```javascript
{
  rating: Number,            // Required, 1-5
  comment: String,           // Required, max 500 chars
  user: UserId,             // User reference
  place: PlaceId,           // Place reference
  createdAt: Date,          // Auto-generated
  updatedAt: Date           // Auto-generated
}
```

## Authorization Rules

### Place Updates/Deletes

- **Creator** can update/delete their own places
- **Admin** can update/delete any place
- **SuperUser** can update/delete any place

### Review Updates/Deletes

- **Creator** can update/delete their own reviews
- **Admin** can update/delete any review
- **SuperUser** can update/delete any review

## Place Endpoints

### Get All Places

**GET** `/api/places`

**Query Parameters:**

- `tags` - Filter by tags (comma-separated)
- `minRating` - Minimum average rating
- `limit` - Results per page (default: 20)
- `page` - Page number (default: 1)

**Example:**

```bash
GET /api/places?tags=restaurant,cafe&minRating=4&limit=10&page=1
```

**Response:**

```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "...",
      "title": "Beautiful Park",
      "image": {
        "src": "https://example.com/image.jpg",
        "alt": "Park view",
        "thumbnail": "https://example.com/thumb.jpg"
      },
      "longitude": 13.405,
      "latitude": 52.52,
      "summary": "A beautiful park in the city center",
      "tags": ["park", "nature", "outdoor"],
      "averageRating": 4.5,
      "reviewCount": 12,
      "createdBy": {
        "_id": "...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "reviews": [...],
      "createdAt": "2024-10-02T13:00:00.000Z",
      "updatedAt": "2024-10-02T13:00:00.000Z"
    }
  ]
}
```

### Get Single Place

**GET** `/api/places/:id`

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Beautiful Park",
    "image": {...},
    "longitude": 13.405,
    "latitude": 52.52,
    "summary": "A beautiful park in the city center",
    "tags": ["park", "nature"],
    "averageRating": 4.5,
    "reviewCount": 12,
    "createdBy": {...},
    "reviews": [...],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Create Place

**POST** `/api/places`

**Headers:**

```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "title": "Beautiful Park",
  "image": {
    "src": "https://example.com/image.jpg",
    "alt": "Park view",
    "thumbnail": "https://example.com/thumb.jpg"
  },
  "longitude": 13.405,
  "latitude": 52.52,
  "summary": "A beautiful park in the city center",
  "tags": ["park", "nature", "outdoor"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Beautiful Park",
    ...
  }
}
```

### Update Place

**PUT** `/api/places/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Authorization:** Creator, Admin, or SuperUser only

**Body:** Same as Create Place

### Delete Place

**DELETE** `/api/places/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Authorization:** Creator, Admin, or SuperUser only

**Response:**

```json
{
  "success": true,
  "data": {},
  "message": "Place and associated reviews deleted successfully"
}
```

### Get Nearby Places

**GET** `/api/places/nearby/:longitude/:latitude`

**Query Parameters:**

- `maxDistance` - Maximum distance in meters (default: 10000)

**Example:**

```bash
GET /api/places/nearby/13.405/52.52?maxDistance=5000
```

**Response:**

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "title": "Beautiful Park",
      "distance": 1234,
      ...
    }
  ]
}
```

## Review Endpoints

### Get Reviews for a Place

**GET** `/api/places/:placeId/reviews`

**Response:**

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "rating": 5,
      "comment": "Amazing place!",
      "user": {
        "_id": "...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "place": "...",
      "createdAt": "2024-10-02T13:00:00.000Z",
      "updatedAt": "2024-10-02T13:00:00.000Z"
    }
  ]
}
```

### Create Review

**POST** `/api/places/:placeId/reviews`

**Headers:**

```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "rating": 5,
  "comment": "Amazing place! Highly recommended."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "rating": 5,
    "comment": "Amazing place!",
    "user": {...},
    "place": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Note:** Users can only create one review per place.

### Get My Reviews

**GET** `/api/reviews/my-reviews`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "rating": 5,
      "comment": "Great!",
      "place": {
        "_id": "...",
        "title": "Beautiful Park",
        "image": {...}
      },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### Update Review

**PUT** `/api/reviews/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Authorization:** Review creator, Admin, or SuperUser only

**Body:**

```json
{
  "rating": 4,
  "comment": "Updated review text"
}
```

### Delete Review

**DELETE** `/api/reviews/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Authorization:** Review creator, Admin, or SuperUser only

**Response:**

```json
{
  "success": true,
  "data": {},
  "message": "Review deleted successfully"
}
```

## User Roles

### user (default)

- Can create places
- Can create reviews
- Can update/delete own places
- Can update/delete own reviews

### admin

- All user permissions
- Can update/delete any place
- Can update/delete any review

### superUser

- All admin permissions
- Highest level of access

## Example Workflows

### 1. Create a Place and Add Review

```bash
# 1. Register/Login to get token
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# 2. Create a place
curl -X POST http://localhost:4000/api/places \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Central Park",
    "image": {
      "src": "https://example.com/park.jpg",
      "alt": "Central Park view"
    },
    "longitude": -73.965355,
    "latitude": 40.782865,
    "summary": "A large public park in New York City",
    "tags": ["park", "nature", "nyc"]
  }'

# 3. Add a review (use placeId from step 2)
curl -X POST http://localhost:4000/api/places/PLACE_ID/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "Beautiful park, perfect for a weekend visit!"
  }'
```

### 2. Find Nearby Places

```bash
# Find places within 5km of coordinates
curl -X GET "http://localhost:4000/api/places/nearby/-73.965355/40.782865?maxDistance=5000"
```

### 3. Search Places by Tags

```bash
# Find all parks with rating >= 4
curl -X GET "http://localhost:4000/api/places?tags=park&minRating=4"
```
