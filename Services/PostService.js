import PostDao from "../DAOs/PostDao.js";
import { createResponse } from "../Utils/utils.js";


export default class PostService {
    constructor() {
        this.postDao = new PostDao();
    }

    async getAllPosts() {
        return await this.postDao.getAll();
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
    async deletePost({ post_id, auth_id }) {
        if (!post_id || isNaN(post_id) || !auth_id) {
            return createResponse(false, "Missing post id or author id");
        }
        return await this.postDao.delete({ post_id, auth_id });
    }

    async searchPosts({ searchTerm, filterBy, page = 1, limit = 10 }) {
        // 1) Get total count
        const countRes = await this.postDao.countSearchResults({ searchTerm, filterBy });
        if (!countRes.success) return countRes;

        const totalItems = countRes.data;
        if (totalItems === 0) {
            return { success: false, data: "No posts found matching the search criteria." };
        }

        // 2) Get the page of rows
        const rowsRes = await this.postDao.searchPosts({ searchTerm, filterBy, page, limit });
        if (!rowsRes.success) return rowsRes;

        // 3) Compute total pages
        const totalPages = Math.ceil(totalItems / limit);

        // 4) Wrap into a single payload
        return {
            success: true,
            data: {
                posts: rowsRes.data,
                meta: {
                    page,
                    limit,
                    totalItems,
                    totalPages
                }
            }
        };
    }




    async getPosts({ sortBy, page, limit }) {
        return await this.postDao.getPostsSorted({ sortBy, page, limit });
    }

}