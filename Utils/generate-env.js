import fs from 'fs';
import path from 'path';

const envFilePath = path.resolve(process.cwd(), '.env');

const defaultEnvContent = [
    "SESSION_SECRET=randomSecret",
    "JWT_SECRET=randomJWT",
    "CSRF_SECRET=randomCSRF"
].join("\n") + "\n";

if (!fs.existsSync(envFilePath)) {
    fs.writeFileSync(envFilePath, defaultEnvContent);
    console.log("'.env' file generated with default values.");
} else {
    console.log("'.env' file already exists, not overwriting.");
}
