// import { ApiService } from "../Services/ApiService.js";

// const apikeyMiddleware = async (req, res, next) => {
//   const key = req.header("X-API-Key");

//   if (!key) {
//     return res.status(401).json({ error: "API Key Missing" });
//   }

//   const apiService = new ApiService();
//   try {
//     const result = await apiService.validateKey(key);

//     if (!result.success) {
//       return res.status(403).json({ error: "Invalid API Key" });
//     }

//     // Update 'last_used' timestamp to track when it was used
//     await apiService.updateLastUsed(key);

//     // Attach key owner data to req for later use
//     req.user = result.data.user;
//     req.apiKey = key; // Attach API key to request

//     next();
//   } catch (error) {
//     console.error("API Key Authentication Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export default apikeyMiddleware;
