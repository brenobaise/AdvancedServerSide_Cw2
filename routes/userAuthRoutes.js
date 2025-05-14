import express from "express";
import { AuthService } from "../Services/AuthService.js"

const router = express.Router();


// back end to register a user
router.post("/signup", async (req, res) => {
  const authService = new AuthService();
  try {
    const result = await authService.register(req.body);

    // redirects to login once registered.
    res.redirect("/login");
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
});

// backend to login 
router.post("/login", async (req, res) => {
  // starts an authservice,
  // checks if email and password match database
  // sets jwt and csrf token to a cookie
  const authService = new AuthService();

  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    if (!result) {
      return res.status(404).json({ error: 'Invalid credentials' })
    }

    // set JWT in HTTP-Only cookie
    res.cookie('jwt', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 1000
    })

    // set csrf
    res.cookie('csrf-token', result.csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    // store user details in the session
    req.session.user = result.user;

    // **Generate the CSRF token once per session if not already 
    if (!req.session.csrfToken) {
      req.session.csrfToken = generateCSRFToken();
    }

    res.redirect("/api/admin/dashboard");
  } catch (err) {
    res.status(500).json({
      error: err.message
    })
  }

});

// backend for logout
router.post("/logout", (req, res) => {
  // check for CSRF here if not already handled globally.
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Logout failed" });
    }
    // Clear cookies if needed
    res.clearCookie("jwt");
    res.clearCookie("csrf-token");
    // Redirect to login page
    res.redirect("/login");
  });
});
export default router;
