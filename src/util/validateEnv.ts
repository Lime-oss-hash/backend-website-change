import { cleanEnv } from "envalid";
import { port, str, num } from "envalid/dist/validators";

export default cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: str(),
    PORT: port(),
    SESSION_SECRET: str(),
    JWT_SECRET: str(),
    // HASH_LENGTH: num(),
    // PW_LENGTH: num(),
    // NUMBERS: bool(),
    SMTP_SERVER_ADDRESS: str(),
    SMTP_PORT: num(),
    SMTP_LOGIN: str(),
    SMTP_PASSWORD: str(),
    CREDENTIALS: str(),
    CALENDAR_ID: str(),
});