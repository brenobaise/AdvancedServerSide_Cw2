import express from "express"
import PostService from "../Services/PostService.js";
import authenticateJWT from "../middleware/jwtAuth.js";


const router = express.Router();
const postService = new PostService();

router.post("/posts", async (req, res) => {
    try {
        const result = await postService.createNewPost(req.body);
        res.status(result.success ? 201 : 400).json(result);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message,
        });
    }
})

router.get("/posts/:id", async (req, res) => {
    try {
        const post_id = parseInt(req.params.id, 10);
        const result = await postService.getPostById(post_id);
        res.status(result.success ? 200 : 400).json(result);

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        })
    }
})

router.put("/posts/:id", async (req, res) => {
    try {
        const post_id = parseInt(req.params.id, 10);
        // for testing, grab author_id straight from the body
        const { author_id, title, content, country, date_of_visit } = req.body;
        const payload = { post_id, auth_id: author_id, title, content, country, date_of_visit };
        const result = await postService.editPost(payload);
        res.status(result.success ? 200 : 400).json(result);

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        })
    }

});

router.delete("/posts/:id", async (req, res) => {
    try {
        const post_id = parseInt(req.params.id, 10);
        // for testing without auth, read author_id from body:
        const { author_id } = req.body;

        const result = await postService.deletePost({ post_id, auth_id: author_id });
        res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
        console.error("DELETE /posts/:id error:", err);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
});

export default router;

