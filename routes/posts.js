import express from "express"
import PostService from "../Services/PostService.js";
import authenticateJWT from "../middleware/jwtAuth.js";
import ReactionService from "../Services/ReactionService.js";


const router = express.Router();
const postService = new PostService();

router.get("/posts/search", async (req, res) => {
    try {
        const { searchTerm, filterBy } = req.query;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        if (!searchTerm || !filterBy) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameters: searchTerm and filterBy"
            });
        }

        const result = await postService.searchPosts({ searchTerm, filterBy, page, limit });

        // if DAO returned success:false (no rows or invalid filter)
        if (!result.success) {
            return res.status(404).json(result);
        }

        res.status(200).json(result);
    } catch (err) {
        console.error("Error in /posts/search:", err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});


router.get("/posts", async (req, res) => {
    try {
        const sortBy = req.query.sortBy || "newest";
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        const result = await postService.getPosts({ sortBy, page, limit });
        if (!result.success) {
            return res.status(400).json(result);
        }

        res.status(200).json(result);
    } catch (err) {
        console.error("Error in /posts:", err);
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
});


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


router.use(authenticateJWT);

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
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
});

router.post(
    "/posts/:id/reactions",
    authenticateJWT,
    async (req, res, next) => {

        const reactionService = new ReactionService()
        const post_id = Number(req.params.id);
        const user_id = req.session.user?.id;
        const { reaction } = req.body;

        if (!user_id) {
            return res
                .status(401)
                .json({ success: false, error: "Not authenticated" });
        }

        try {
            const result = await reactionService.react({ post_id, user_id, reaction });
            if (!result.success) {
                return res.status(400).json(result);
            }
            // Return updated counts too, if you like:
            // you could fetch the post here and include likes_count/dislikes_count
            return res.json(result);
        } catch (err) {
            next(err);
        }
    }
);


export default router;

