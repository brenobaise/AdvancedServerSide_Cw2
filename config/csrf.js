import Tokens from "csrf";

const tokens = new Tokens();

const generateToken = () => {
    return tokens.create(process.env.CSRF_SECRET);
}

const verifyToken = (token) => {
    return tokens.verify(process.env.CSRF_SECRET, token);
}

export { generateToken, verifyToken };
