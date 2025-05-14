import { dbConnection } from "../Databases/SQLConn.js";
import { createResponse } from "../Utils/utils.js";

export default class PostDao {
    constructor() {

    }

    async create(req) {
        return new Promise((resolve, reject) => {
            dbConnection.run(
                "INSERT INTO posts ("
            )
        })
    }
}