// import { v4 as uuidv4 } from "uuid";
// import { ApiKeyDao } from "../DAOs/ApiKeyDao.js";
// export class ApiService {
//     constructor() {
//         this.apikeydao = new ApiKeyDao();
//     }

//     async create(userID) {
//         const key = uuidv4();
//         return await this.apikeydao.create(key, userID);
//     }
//     async delete(key) {
//         return await this.apikeydao.delete(key);
//     }

//     async validateKey(key) {
//         // validates only the key which is active
//         return await this.apikeydao.getById(key);
//     }
//     async getAllByKey(key) {
//         return await this.apikeydao.getAllById(key);
//     }
//     async getById(userID) {
//         return await this.apikeydao.getByUserID(userID);
//     }
//     async updateStatus(key, status) {
//         return await this.apikeydao.updateActiveStatus(key, status);
//     }
//     async updateLastUsed(key) {
//         return await this.apikeydao.updateLastUsed(key);
//     }
//     async validate(key) {
//         // validate the key wether it's active or not
//         return await this.apikeydao.getByKey(key);
//     }
// }
