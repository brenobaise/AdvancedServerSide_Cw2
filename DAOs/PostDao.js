import { rejects } from "assert";
import { dbConnection } from "../Databases/SQLConn.js";
import { createResponse } from "../Utils/utils.js";

export default class PostDao {
    constructor() { }
    async getAll() {
        return new Promise((resolve, reject) => {
            dbConnection.all(
                `SELECT * 
               FROM posts
              ORDER BY date_posted DESC`,
                [],
                (err, rows) => {
                    if (err) return reject(createResponse(false, null, err));
                    resolve(createResponse(true, rows));
                }
            );
        });
    }


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
                    resolve(createResponse(true, { id: this.lastID }, null, 201
                    ))
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
            // 1) Remove reactions
            dbConnection.run(
                "DELETE FROM post_reactions WHERE post_id = ?",
                [post_id],
                function (err) {
                    if (err) return reject(createResponse(false, null, err));
                    // 2) Remove the post
                    dbConnection.run(
                        "DELETE FROM posts WHERE id = ? AND author_id = ?",
                        [post_id, auth_id],
                        function (err2) {
                            if (err2) return reject(createResponse(false, null, err2));
                            if (this.changes === 0) {
                                return resolve(createResponse(false, "Post not found or not authorised"));
                            }
                            resolve(createResponse(true, "Post and its reactions deleted"));
                        }
                    );
                }
            );
        });
    }


    // In DAOs/PostDao.js
    async searchPosts({ searchTerm, filterBy, page = 1, limit = 10 }) {
        return new Promise((resolve, reject) => {
            // only allow the two filters
            if (!["country", "username"].includes(filterBy)) {
                return resolve(createResponse(false, null, "Invalid filterBy value"));
            }

            // build WHERE + params
            let where;
            const params = [];
            if (filterBy === "country") {
                where = "WHERE LOWER(p.country) LIKE ?";
                params.push(`%${searchTerm.trim().toLowerCase()}%`);
            } else {
                where = "WHERE u.username LIKE ?";
                params.push(`%${searchTerm.trim()}%`);
            }

            const offset = (page - 1) * limit;
            const sql = `
        SELECT
          p.id,
          p.title,
          u.username   AS author,
          p.date_posted,
          p.country
        FROM posts p
        JOIN users u
          ON p.author_id = u.id
        ${where}
        ORDER BY p.date_posted DESC
        LIMIT ? OFFSET ?
      `;
            params.push(limit, offset);

            dbConnection.all(sql, params, (err, rows) => {
                if (err) {
                    return reject(createResponse(false, null, err));
                }
                if (!rows || rows.length === 0) {
                    return resolve(createResponse(false, "No posts found matching the search criteria."));
                }
                resolve(createResponse(true, rows));
            });
        });
    }



    async countSearchResults({ searchTerm, filterBy }) {
        return new Promise((resolve, reject) => {
            if (!["country", "username"].includes(filterBy)) {
                return resolve(createResponse(false, null, "Invalid filterBy value"));
            }

            let whereClause;
            const params = [];

            if (filterBy === "country") {
                whereClause = "WHERE LOWER(country) LIKE ?";
                params.push(`%${searchTerm.trim().toLowerCase()}%`);
            } else {
                whereClause = "WHERE username LIKE ?";
                params.push(`%${searchTerm.trim()}%`);
            }

            const sql = `SELECT COUNT(*) AS count FROM posts p
                   JOIN users u ON p.author_id = u.id
                   ${whereClause}`;

            dbConnection.get(sql, params, (err, row) => {
                if (err) return reject(createResponse(false, null, err));
                resolve(createResponse(true, row.count));
            });
        });
    }

    async getPostsSorted({ sortBy = "newest", page = 1, limit = 10 }) {
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * limit;
            let sql, params;

            if (sortBy === "newest") {
                sql = `
          SELECT p.id, p.title, u.username AS author,
                 p.date_posted, p.country, p.likes_count
            FROM posts p
            JOIN users u ON p.author_id = u.id
           ORDER BY p.date_posted DESC
           LIMIT ? OFFSET ?`;
                params = [limit, offset];

            } else if (sortBy === "liked") {
                sql = `
          SELECT p.id, p.title, u.username AS author,
                 p.date_posted, p.country, p.likes_count
            FROM posts p
            JOIN users u ON p.author_id = u.id
           ORDER BY p.likes_count DESC, p.date_posted DESC
           LIMIT ? OFFSET ?`;
                params = [limit, offset];

            } else if (sortBy === "commented") {
                sql = `
          SELECT p.id, p.title, u.username AS author,
                 p.date_posted, p.country,
                 p.likes_count,
                 COUNT(c.id) AS comment_count
            FROM posts p
            JOIN users u   ON p.author_id = u.id
            LEFT JOIN comments c ON c.post_id = p.id
           GROUP BY p.id
           ORDER BY comment_count DESC, p.date_posted DESC
           LIMIT ? OFFSET ?`;
                params = [limit, offset];

            } else {
                return resolve(createResponse(false, null, "Invalid sortBy value"));
            }

            dbConnection.all(sql, params, (err, rows) => {
                if (err) return reject(createResponse(false, null, err));
                resolve(createResponse(true, rows));
            });
        });
    }
    // add inside PostDao class
    async incrementLikes({ post_id }) {
        return new Promise((res, rej) => {
            dbConnection.run(
                `UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?`,
                [post_id],
                function (err) {
                    if (err) return rej(createResponse(false, null, err));
                    res(createResponse(true));
                }
            );
        });
    }
    async decrementLikes({ post_id }) {
        return new Promise((res, rej) => {
            dbConnection.run(
                `UPDATE posts SET likes_count = likes_count - 1 WHERE id = ? AND likes_count > 0`,
                [post_id],
                function (err) {
                    if (err) return rej(createResponse(false, null, err));
                    res(createResponse(true));
                }
            );
        });
    }
    async incrementDislikes({ post_id }) {
        return new Promise((res, rej) => {
            dbConnection.run(
                `UPDATE posts SET dislikes_count = dislikes_count + 1 WHERE id = ?`,
                [post_id],
                function (err) {
                    if (err) return rej(createResponse(false, null, err));
                    res(createResponse(true));
                }
            );
        });
    }
    async decrementDislikes({ post_id }) {
        return new Promise((res, rej) => {
            dbConnection.run(
                `UPDATE posts SET dislikes_count = dislikes_count - 1 WHERE id = ? AND dislikes_count > 0`,
                [post_id],
                function (err) {
                    if (err) return rej(createResponse(false, null, err));
                    res(createResponse(true));
                }
            );
        });
    }


}

