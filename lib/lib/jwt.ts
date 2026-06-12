import jwt, { verify } from "jsonwebtoken";

export interface JwtPayload{
    id: string;
    email: string;

}

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export function signToken(payload: JwtPayload):string{
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "7d" 
    })
}

export function verifyToken(token: string):JwtPayload{
    return jwt.verify(token, JWT_SECRET) as JwtPayload
}
