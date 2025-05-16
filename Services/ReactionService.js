import ReactionDao from "../DAOs/ReactionsDao.js";
import PostDao from "../DAOs/PostDao.js";
import { createResponse } from "../Utils/utils.js";

export default class ReactionService {
    constructor() {
        this.reactionDao = new ReactionDao();
        this.postDao = new PostDao();
    }


    async react(data) {
        const { post_id, user_id, reaction } = data;
        if (!["like", "dislike"].includes(reaction)) {
            return createResponse(false, "Invalid reaction");
        }

        // 1) see if user already reacted
        const existingRes = await this.reactionDao.getByPostAndUser({ post_id, user_id });
        if (!existingRes.success) return existingRes;
        const existing = existingRes.data;

        // 2) no existing → create + increment
        if (!existing) {
            await this.reactionDao.create({ post_id, user_id, reaction });
            if (reaction === "like") await this.postDao.incrementLikes({ post_id });
            else await this.postDao.incrementDislikes({ post_id });
            return createResponse(true, "Reaction added");
        }

        // 3) same reaction → delete (toggle off) + decrement
        if (existing.reaction === reaction) {
            await this.reactionDao.delete({ post_id, user_id });
            if (reaction === "like") await this.postDao.decrementLikes({ post_id });
            else await this.postDao.decrementDislikes({ post_id });
            return createResponse(true, "Reaction removed");
        }

        // 4) different reaction → update + inc new, dec old
        await this.reactionDao.update({ post_id, user_id, reaction });
        if (reaction === "like") {
            await this.postDao.incrementLikes({ post_id });
            await this.postDao.decrementDislikes({ post_id });
        } else {
            await this.postDao.incrementDislikes({ post_id });
            await this.postDao.decrementLikes({ post_id });
        }
        return createResponse(true, "Reaction switched");
    }
}
