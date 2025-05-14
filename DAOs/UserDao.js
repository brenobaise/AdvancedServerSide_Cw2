import { dbConnection } from "../Databases/SQLConn.js";
import { createResponse } from "../Utils/utils.js";

export default class UserDao {
  constructor() { }

  async create(req) {
    return new Promise((resolve, reject) => {
      dbConnection.run(
        "INSERT INTO users (email,password,fn,SN) VALUES (?,?,?,?)",
        [...Object.values(req.body)],
        function (err) {
          if (err) {
            return reject(createResponse(false, null, err));
          }
          if (this.changes === 0) {
            return resolve(createResponse(false, "No Record Inserted"));
          }
          resolve(createResponse(true, "Record Inserted"));
        }
      );
    });
  }
  async createUser(userData) {
    const { email, password, fn, SN, username } = userData;
    return new Promise((resolve, reject) => {
      dbConnection.run(
        `INSERT INTO users (email, password, fn, sn, username) VALUES (?, ?, ?, ?, ?)`,
        [email, password, fn, SN, username],
        function (err) {
          if (err) {
            return reject(createResponse(false, null, err));
          }
          if (this.changes === 0) {
            return reject(createResponse(false, "No Record Inserted"));
          }
          resolve(this.lastID);
        }
      );
    });
  }


  async findUserById(userId) {
    return new Promise((resolve, reject) => {
      dbConnection.get(
        "SELECT * FROM users WHERE id = ?",
        [userId],
        (err, row) => {
          if (err) {
            return reject(createResponse(false, null, err));
          }
          if (!row) {
            return resolve(createResponse(false, null));
          }
          resolve(createResponse(true, row));
        }
      );
    });
  }

  async getByEmail(email) {
    return new Promise((resolve, reject) => {
      dbConnection.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, rows) => {
          if (err) {
            reject(err);
          }
          if (!rows) {
            resolve(createResponse(false, null));
          }
          resolve(createResponse(true, rows));
        }
      );
    });
  }
  async getByUsername(username) {
    return new Promise((resolve, reject) => {
      dbConnection.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, row) => {
          if (err) return reject(createResponse(false, null, err));
          if (!row) return resolve(createResponse(false, null));
          resolve(createResponse(true, row));
        }
      );
    });
  }

}
