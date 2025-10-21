// MongoDB initialization script for development
db = db.getSiblingDB("places_app_dev");

// Create application user for development
db.createUser({
  user: "dev_user",
  pwd: "dev_password",
  roles: [
    {
      role: "readWrite",
      db: "places_app_dev",
    },
  ],
});

// Create collections
db.createCollection("users");
db.createCollection("places");
db.createCollection("reviews");

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.places.createIndex({ name: 1 });
db.places.createIndex({ location: "2dsphere" });
db.reviews.createIndex({ placeId: 1 });

// Insert sample data for development
db.users.insertMany([
  {
    name: "Test User",
    email: "test@example.com",
    password: "$2a$10$rVGnQoZgYuOe0YO/YGpHnOQz9.7M3e8YpFjHjUxLvAcq9rJJ3j2KG", // password: testpass
    role: "user",
    createdAt: new Date(),
  },
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "$2a$10$rVGnQoZgYuOe0YO/YGpHnOQz9.7M3e8YpFjHjUxLvAcq9rJJ3j2KG", // password: testpass
    role: "admin",
    createdAt: new Date(),
  },
]);

db.places.insertMany([
  {
    name: "Test Restaurant",
    description: "A great place for testing",
    category: "restaurant",
    location: {
      type: "Point",
      coordinates: [13.405, 52.52], // Berlin coordinates
    },
    address: "Test Street 123, Berlin",
    rating: 4.5,
    createdAt: new Date(),
  },
  {
    name: "Test Cafe",
    description: "Perfect coffee spot",
    category: "cafe",
    location: {
      type: "Point",
      coordinates: [13.415, 52.53],
    },
    address: "Cafe Street 456, Berlin",
    rating: 4.8,
    createdAt: new Date(),
  },
]);

print("Development database initialization completed with sample data!");
