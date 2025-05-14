// import express from "express";
// import { ApiService } from "../Services/ApiService.js";
// import { formatDate } from "../Utils/utils.js";
// const router = express.Router();

// router.get("/dashboard", async (req, res) => {
//   // checks if the user is logged in
//   // starts an api service to get all the user keys
//   // returns it to the view as a list
//   if (!req.session.user || !req.user) {
//     return res.redirect("/login");
//   }

//   try {
//     const apiService = new ApiService();
//     const keys = await apiService.getById(req.session.user.id);
//     const keyList = Array.isArray(keys.data) ? keys.data : [keys.data.key];


//     // formats the dates for display
//     keyList.forEach((key) => {
//       if (key.created_at) {
//         key.created_at = formatDate(key.created_at);
//       }
//       if (key.last_used) {
//         key.last_used = formatDate(key.last_used);
//       }
//     });


//     res.render("dashboard", {
//       title: "Dashboard",
//       firstName: req.session.user.fn,
//       keys: keyList,
//       userID: req.session.user.id || req.user.id,
//       csrfToken: req.session.csrfToken
//     });

//   } catch (error) {
//     console.error("Error fetching keys:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // changes the availabilty of a key
// router.post("/changeStatus", async (req, res) => {
//   const { key, is_active } = req.body;

//   try {
//     if (!key || is_active == null) {
//       return res.redirect("dashboard");
//     }

//     const apiService = new ApiService();
//     const result = await apiService.validate(key);

//     // replace with more robust error handling
//     if (!result.success) {
//       return res.status(400).json({ error: "Invalid API Key" });
//     }

//     const updateResult = await apiService.updateStatus(key, is_active);

//     if (!updateResult.success) {
//       return res.status(400).json({ error: "Failed to update API Key status" });
//     }

//     res.redirect("dashboard");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // deletes a key
// router.post("/deleteKey", async (req, res) => {
//   const { key } = req.body;
//   const apiService = new ApiService();

//   try {
//     if (!key) {
//       res.redirect("dashboard");
//     }

//     const result = await apiService.delete(key);
//     if (result.success) {
//       res.redirect("dashboard");
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // generates a key
// router.post("/genKey", async (req, res) => {
//   const referer = req.get("Referer");
//   let userID;

//   // Check if request comes from the dashboard
//   if (referer && referer.includes("/dashboard")) {
//     userID = req.session.user.id; //  Use session user ID if request comes from dashboard
//   } else {
//     userID = req.body.userID; //  Use userID from request body if coming from elsewhere
//   }

//   try {
//     const apiService = new ApiService();
//     await apiService.create(userID);

//     res.redirect("dashboard");
//   } catch (error) {
//     console.error("Error Creating API Key: ", error);
//     res.status(500).json({ error: "Error creating API key" });
//   }
// });

// // validates a key
// router.get("/validateKey", async (req, res) => {
//   try {
//     const key = req.header("X-API-Key");
//     const apiService = new ApiService();
//     const data = await apiService.validateKey(key);
//     res.status(200).json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "error finding key" });
//   }
// });
// export default router;
