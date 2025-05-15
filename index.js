import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from 'path';
import { fileURLToPath } from 'url';

import userAuthRoutes from "./routes/userAuthRoutes.js";
import countriesRoutes from "./routes/countries.js";
import csrfProtection from "./middleware/csrf.js";
import { generateToken as generateCSRFToken } from './config/csrf.js';
import blogPostRoutes from "./routes/posts.js"
import authenticateJWT from "./middleware/jwtAuth.js";
import PostService from './Services/PostService.js';


const app = express();
const PORT = 5005;


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Adds CSRF token from session to res.locals so it's available in views
app.use((req, res, next) => {
  if (req.session && req.session.csrfToken) {
    res.locals.csrfToken = req.session.csrfToken;
  }
  res.locals.csrfToken = req.session.csrfToken;
  next();
});

// CSRF protection to state - changing routes(POST, PUT, DELETE)
app.use((req, res, next) => {
  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    return csrfProtection(req, res, next);
  }
  next();
});



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

app.get("/home", (req, res) => res.render("home"));
app.get("/search", (req, res) => res.render("search"))

app.use("/api", blogPostRoutes);
app.use("/api", countriesRoutes);

app.get("/explore-country", (req, res) => {
  res.render("explore-country", { csrfToken: req.session.csrfToken });
});




app.get("/profile", authenticateJWT, (req, res) => {
  res.render("profile", { userId: req.session.user.id, username: req.session.user.username });
});

app.get("/posts/new", authenticateJWT, (req, res) => {
  res.render("newpost", { userId: req.session.user.id });
});

app.get("/posts/:id/edit", authenticateJWT, async (req, res, next) => {
  const postService = new PostService();

  try {
    // 1. Load the post
    const postResponse = await postService.getPostById(req.params.id);
    const post = postResponse.data;         // unwrap the .data
    if (!post) return res.status(404).send("Post not found");

    // 2. Ownership check
    if (post.author_id !== req.session.user.id) {
      return res.status(403).send("Not authorized to edit this post");
    }

    // 3. Generate & stash CSRF
    const csrfToken = generateCSRFToken();
    req.session.csrfToken = csrfToken;

    // 4. Render with post + csrfToken
    res.render("editpost", {
      post,
      userId: req.session.user.id,
      csrfToken,                       // <-- your own token
    });
  } catch (err) {
    next(err);
  }
});

app.get("/posts/:id", (req, res) => {
  res.render("viewpost", { postId: req.params.id });
});


app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});
