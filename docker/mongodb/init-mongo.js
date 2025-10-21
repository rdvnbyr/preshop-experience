// MongoDB initialization script for production
db = db.getSiblingDB("places_app");

// Create application user
db.createUser({
  user: "places_user",
  pwd: "places_password_change_in_production",
  roles: [
    {
      role: "readWrite",
      db: "places_app",
    },
  ],
});

// Create collections and indexes
db.createCollection("users");
db.createCollection("places");
db.createCollection("reviews");

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: 1 });

db.places.createIndex({ name: 1 });
db.places.createIndex({ location: "2dsphere" });
db.places.createIndex({ category: 1 });
db.places.createIndex({ createdAt: 1 });

db.reviews.createIndex({ placeId: 1 });
db.reviews.createIndex({ userId: 1 });
db.reviews.createIndex({ createdAt: 1 });

print("Database initialization completed successfully!");
