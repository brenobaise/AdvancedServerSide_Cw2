import { rejects } from "assert";
import { dbConnection } from "../Databases/SQLConn.js";
import { createResponse } from "../Utils/utils.js";

export default class PostDao {
    constructor() { }

    async create({ auth_id, title, content, country, date_of_visit }) {
        return new Promise((resolve, reject) => {
            dbConnection.run(
                `INSERT INTO posts (author_id,title,content,country,date_of_visit)
                VALUES (?,?,?,?,?)`
                , [auth_id, title, content, country, date_of_visit],
                function (err) {
                    if (err) {
                        return reject(createResponse(false, null, err))
                    }
                    if (this.changes === 0) {
                        return resolve(createResponse(false, "No Records Inserted"))
                    }
                    resolve(createResponse(true, "Post created successfully", { id: this.lastID }, 201))
                });
        });
    }

    async getByID({ post_id }) {
        return new Promise((resolve, reject) => {
            dbConnection.get(
                "SELECT * FROM posts WHERE id = ? ",
                [post_id],
                (err, row) => {
                    if (err) return reject(createResponse(false, null, err));
                    if (!row) return resolve(createResponse(false, "Post not found"))

                    // returns the post if it's all good.
                    resolve(createResponse(true, row, null, 200))

                }
            )
        });
    }

    async update({ post_id, auth_id, title, content, country, date_of_visit }) {
        return new Promise((resolve, reject) => {
            dbConnection.run(`UPDATE posts SET title = ?, content = ?, country = ?, date_of_visit = ?
                WHERE id = ? AND author_id = ? `,
                [title, content, country, date_of_visit, post_id, auth_id],
                function (err) {
                    if (err) return reject(createResponse(false, null, err));
                    // Either the post doesn't exist, or it doesn't belong to this author
                    if (this.changes === 0) {
                        return resolve(createResponse(false, "Post not found or not authorised"));
                    }

                    // update the post
                    resolve(createResponse(true, "Post updated", null, 201))
                }
            )
        })

    }

    async delete({ post_id, auth_id }) {
        return new Promise((resolve, reject) => {
            dbConnection.run(` DELETE FROM posts WHERE id = ? AND author_id = ?`,
                [post_id, auth_id],
                function (err) {
                    if (err) return reject(createResponse(false, null, err));
                    if (this.changes === 0) return resolve(createResponse(false, "Post not found or not authorised"))
                })
            resolve(createResponse(true, "Post deleted", null, 204))
        })
    }

}

