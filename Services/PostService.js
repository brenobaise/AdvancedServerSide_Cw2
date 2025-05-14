import PostDao from "../DAOs/PostDao.js";
import { createResponse } from "../Utils/utils.js";


export default class PostService {
    constructor() {
        this.postDao = new PostDao();
    }

    async createNewPost(data) {
        const { auth_id, title, content, country, date_of_visit } = data;

        if (!auth_id || !title || !content || !country || !date_of_visit) {
            return createResponse(false, "Missing required fields")
        }

        return await this.postDao.create({ auth_id, title, content, country, date_of_visit })
    }

    async getPostById(post_id) {
        if (!post_id || isNaN(post_id)) return createResponse(false, "Missing a post id")
        return await this.postDao.getByID({ post_id });
    }

    async editPost(data) {
        const { post_id, auth_id, title, content, country, date_of_visit } = data;
        if (!auth_id || !title || !content || !country || !date_of_visit) return createResponse(false, "Missing identifiers");

        return await this.postDao.update({ post_id, auth_id, title, content, country, date_of_visit });
    }
}