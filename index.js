import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

import userAuthRoutes from "./routes/userAuthRoutes.js";
// import adminRoutes from "./routes/admin.js";
import countriesRoutes from "./routes/countries.js";
// import csrfProtection from "./middleware/csrf.js";
import authenticateJWT from "./middleware/jwtAuth.js";
import { generateToken as generateCSRFToken } from './config/csrf.js';
import blogPostRoutes from "./routes/posts.js"

const app = express();
const PORT = 5005;


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Adds CSRF token from session to res.locals so it's available in views
app.use((req, res, next) => {
  if (req.session && req.session.csrfToken) {
    res.locals.csrfToken = req.session.csrfToken;
  }
  next();
});

// CSRF protection to state-changing routes (POST, PUT, DELETE)
// app.use((req, res, next) => {
//   if (["POST", "PUT", "DELETE"].includes(req.method)) {
//     return csrfProtection(req, res, next);
//   }
//   next();
// });



/*
 * Routes
 */

app.use("/", userAuthRoutes);

app.get("/", async (req, res) => {
  res.redirect("/login");
})
app.get("/login", async (req, res) => {
  // If the CSRF token is not yet stored in the session, generate and store it.
  if (!req.session.csrfToken) {
    req.session.csrfToken = generateCSRFToken();
  }
  const csrfToken = req.session.csrfToken;

  // Set the CSRF token cookie
  res.cookie('csrf-token', csrfToken, {
    httpOnly: false,
    sameSite: 'strict'
  });

  // Render the login view with the CSRF token
  res.render("login", { csrfToken });
});

app.get("/signup", async (req, res) => {
  // Generate and store a CSRF token if it isn't already in the session
  if (!req.session.csrfToken) {
    req.session.csrfToken = generateCSRFToken();
  }
  const csrfToken = req.session.csrfToken;

  res.cookie('csrf-token', csrfToken, {
    httpOnly: false,
    sameSite: 'strict'
  });

  // Pass the csrfToken to the view explicitly
  // otherwise the user can't access the route
  res.render("signup", { csrfToken });
});

app.get("/blogposts", (req, res) => res.render("blogposts"));

app.use("/api", blogPostRoutes);


// Apply authMiddleware for all protected routes
// app.use("/api/admin", authenticateJWT, adminRoutes);
// app.use("/api", authenticateJWT, countriesRoutes);

app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});
