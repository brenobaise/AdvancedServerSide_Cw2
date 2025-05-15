import express from "express";

const router = express.Router();

router.get("/countries", async (req, res) => {
    try {
        const response = await fetch("http://localhost:6005/api/all", {
            headers: {
                "x-api-key": process.env.COUNTRY_API_KEY
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch countries" });
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            return res.status(500).json({ error: "Invalid data format from country API" });
        }

        res.json(data);

    } catch (err) {
        console.error("Proxy error:", err);
        res.status(500).json({ error: "Internal proxy error" });
    }
});

router.post("/countries/search", async (req, res) => {
    const { country } = req.body;

    try {
        const response = await fetch("http://localhost:6005/api/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.COUNTRY_API_KEY
            },
            body: JSON.stringify({ country })
        });

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error("Proxy error:", err);
        res.status(500).json({ error: "Failed to fetch country details" });
    }
});

export default router;
