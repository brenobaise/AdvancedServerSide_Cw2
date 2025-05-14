import { dbConnection } from "../Databases/SQLConn.js";
import { createResponse } from "../Utils/utils.js";


export default class ReactionsDao {

    async addLike({ post_id, user_id }) {
        return new Promise((resolve, reject) => {
            dbConnection.run(
                `INSERT INTO post_reactions (post_id, user_id, reaction)
             VALUES (?, ?, 'like')
             ON CONFLICT(post_id, user_id)
             DO UPDATE SET reaction = 'like'`,
                [post_id, user_id],
                function (err) {
                    if (err) return reject(createResponse(false, null, err));

                    // Now update counts: set likes_count = count of likes from reactions
                    dbConnection.run(
                        `UPDATE posts SET 
                  likes_count = (SELECT COUNT(*) FROM post_reactions WHERE post_id = ? AND reaction = 'like'),
                  dislikes_count = (SELECT COUNT(*) FROM post_reactions WHERE post_id = ? AND reaction = 'dislike')
                WHERE id = ?`,
                        [post_id, post_id, post_id],
                        function (updateErr) {
                            if (updateErr) return reject(createResponse(false, null, updateErr));
                            resolve(createResponse(true, "Like registered successfully"));
                        }
                    );
                }
            );
        });
    }
    async addDislike({ post_id, user_id }) {
        return new Promise((resolve, reject) => {
            dbConnection.run(
                `INSERT INTO post_reactions (post_id, user_id, reaction)
             VALUES (?, ?, 'dislike')
             ON CONFLICT(post_id, user_id)
             DO UPDATE SET reaction = 'dislike'`,
                [post_id, user_id],
                function (err) {
                    if (err) return reject(createResponse(false, null, err));

                    dbConnection.run(
                        `UPDATE posts SET 
                  likes_count = (SELECT COUNT(*) FROM post_reactions WHERE post_id = ? AND reaction = 'like'),
                  dislikes_count = (SELECT COUNT(*) FROM post_reactions WHERE post_id = ? AND reaction = 'dislike')
                WHERE id = ?`,
                        [post_id, post_id, post_id],
                        function (updateErr) {
                            if (updateErr) return reject(createResponse(false, null, updateErr));
                            resolve(createResponse(true, "Dislike registered successfully"));
                        }
                    );
                }
            );
        });
    }



}