import { dbConnection } from "../Databases/SQLConn.js";
import { createResponse } from "../Utils/utils.js";

export default class ReactionDao {
    async getByPostAndUser({ post_id, user_id }) {
        return new Promise((resolve, reject) => {
            dbConnection.get(
                `SELECT * FROM post_reactions WHERE post_id = ? AND user_id = ?`,
                [post_id, user_id],
                (err, row) => {
                    if (err) return reject(createResponse(false, null, err));
                    resolve(createResponse(true, row || null));
                }
            );
        });
    }

    async create({ post_id, user_id, reaction }) {
        return new Promise((resolve, reject) => {
            dbConnection.run(
                `INSERT INTO post_reactions (post_id, user_id, reaction) VALUES (?,?,?)`,
                [post_id, user_id, reaction],
                function (err) {
                    if (err) return reject(createResponse(false, null, err));
                    resolve(createResponse(true, { id: this.lastID }));
                }
            );
        });
    }

    async update({ post_id, user_id, reaction }) {
        return new Promise((resolve, reject) => {
            dbConnection.run(
                `UPDATE post_reactions SET reaction = ?, created_at = CURRENT_TIMESTAMP
         WHERE post_id = ? AND user_id = ?`,
                [reaction, post_id, user_id],
                function (err) {
                    if (err) return reject(createResponse(false, null, err));
                    resolve(createResponse(true, { changes: this.changes }));
                }
            );
        });
    }

    async delete({ post_id, user_id }) {
        return new Promise((resolve, reject) => {
            dbConnection.run(
                `DELETE FROM post_reactions WHERE post_id = ? AND user_id = ?`,
                [post_id, user_id],
                function (err) {
                    if (err) return reject(createResponse(false, null, err));
                    resolve(createResponse(true, { changes: this.changes }));
                }
            );
        });
    }
}
