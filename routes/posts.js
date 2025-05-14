import express from "express"
import PostService from "../Services/PostService.js";

const router = express.Router();

router.post("/post", async (req, res) => {
    try {
        const result = await PostService.createNewPost(req.body);
        res.status(result.success ? 201 : 400).json(result);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message,
        });
    }
})

router.get("/post/:id", async (req, res) => {
    try {
        const post_id = parseInt(req.params.id, 10);
        const result = await PostService.getPostById(post_id);
        res.status(result.success ? 200 : 400).json(result);

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        })
    }
})
export default router;

