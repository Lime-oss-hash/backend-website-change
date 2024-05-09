import jwt from "jsonwebtoken";
import env from "./validateEnv";

export function signJWT(payload: object, expiresIn: string|number) {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
}

export function verifyJWT(token: string) {
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET)
        return { payload: decoded, expired: false };
    } catch (error) {
        return { payload: null, expired: (error) };
    }
}