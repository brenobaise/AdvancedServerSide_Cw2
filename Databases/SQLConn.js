import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

// Resolve absolute database path
const dbPath = path.resolve("database.db");

// Check if database file exists
console.log("Using database file:", dbPath);
console.log("Database file exists:", fs.existsSync(dbPath));

// Initialize SQLite database
export const dbConnection = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database.");
    initialiseDatabase(); // Run setup function
  }
});

// Create tables if they don't exist
// Create tables if they don't exist
function initialiseDatabase() {
  dbConnection.serialize(() => {
    console.log("Initializing database...");

    // Users table
    dbConnection.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        fn TEXT NOT NULL,
        sn TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_logged_in DATETIME DEFAULT NULL
      )`,
      (err) => {
        if (err) console.error("Error creating users table:", err.message);
        else console.log("Users table is ready.");
      }
    );

    // Posts table
    dbConnection.run(
      `CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        country TEXT NOT NULL,
        date_of_visit DATE NOT NULL,
        date_posted DATETIME DEFAULT CURRENT_TIMESTAMP,
        likes_count INTEGER DEFAULT 0,
        dislikes_count INTEGER DEFAULT 0,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      (err) => {
        if (err) console.error("Error creating posts table:", err.message);
        else console.log("Posts table is ready.");
      }
    );

    // Reactions (likes/dislikes)
    dbConnection.run(
      `CREATE TABLE IF NOT EXISTS post_reactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        reaction TEXT CHECK(reaction IN ('like', 'dislike')) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_id, user_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      (err) => {
        if (err) console.error("Error creating post_reactions table:", err.message);
        else console.log("Post reactions table is ready.");
      }
    );

    // Followers table
    dbConnection.run(
      `CREATE TABLE IF NOT EXISTS followers (
        follower_id INTEGER NOT NULL,
        followee_id INTEGER NOT NULL,
        PRIMARY KEY (follower_id, followee_id),
        FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (followee_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      (err) => {
        if (err) console.error("Error creating followers table:", err.message);
        else console.log("Followers table is ready.");
      }
    );

    // Comments table (optional, but useful for "most commented" sorting)
    dbConnection.run(
      `CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      (err) => {
        if (err) console.error("Error creating comments table:", err.message);
        else console.log("Comments table is ready.");
      }
    );
  });
}


export function forceInitDatabase() {
  initialiseDatabase();
}
