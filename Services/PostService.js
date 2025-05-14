import PostDao from "../DAOs/PostDao.js";
import { createResponse } from "../Utils/utils.js";

const postDao = new PostDao();

export default class PostService {
    static async createNewPost(data) {
        const { auth_id, title, content, country, date_of_visit } = data;

        if (!auth_id || !title || !content || !country || !date_of_visit) {
            return createResponse(false, "Missing required fields")
        }

        return await postDao.create({ auth_id, title, content, country, date_of_visit })
    }
    static async getPostById(post_id) {
        if (!post_id || isNaN(post_id)) return createResponse(false, "Missing a post id")
        return await postDao.getByID({ post_id });
    }
}