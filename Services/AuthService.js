import { genHashPassword, verifyPassword } from "../Utils/bcryptUtils.js";
import UserDao from "../DAOs/UserDao.js"
import { generateTokens } from "../config/jwt.js";

export class AuthService {
    constructor() {
        this.userdao = new UserDao();
    }

    async login(email, password) {
        try {
            const user = await this.userdao.getByEmail(email);
            if (!user || !user.data) return null;

            const userData = user.data;
            const isValidPassword = await verifyPassword(password, userData.password);
            if (!isValidPassword) return null;

            // Generate Tokens based on the plain user data
            const { accessToken, csrfToken } = generateTokens(userData);

            // removes the password from the object
            const userWithoutPassword = { ...userData };
            delete userWithoutPassword.password;

            return {
                accessToken,
                csrfToken,
                user: userWithoutPassword
            };


        } catch (err) {
            throw new Error(`Log in error: ${err.message}`)
        }
    }

    async register(userData) {
        try {
            // Validate  fields
            const { email, password, fn, SN, username } = userData;
            if (!email || !password || !fn || !SN || !username) {
                throw new Error("Missing required fields: email, password, fn, SN, and username");
            }

            // Hash the password
            const hashedPassword = await genHashPassword(password, 10);
            userData.password = hashedPassword;

            // Create user 
            const userId = await this.userdao.createUser(userData);
            const user = await this.userdao.findUserById(userId);

            // Generate JWT and CSRF tokens
            const { accessToken, csrfToken } = generateTokens(user);

            // Remove sensitive data
            delete user.password;

            return {
                accessToken,
                csrfToken,
                user,
            };
        } catch (err) {
            throw new Error(`Registration error: ${err.message}`);
        }
    }

}
