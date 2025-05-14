import express from "express";
// import apikeyMiddleware from "../middleware/ApiAuth.js";

const router = express.Router();

// searches for a country 
router.post("/search", async (req, res) => {
    const { country } = await req.body;

    if (!country) {
        return res.status(400).json({ error: "Insert a country name " });
    }

    try {
        const response = await fetch(
            `https://restcountries.com/v3.1/name/${country}?fields=name,currencies,capital,languages,flags`
        );


        if (!response.ok) {
            throw new Error("Failed to fetch country data");
        }

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
export default router;
