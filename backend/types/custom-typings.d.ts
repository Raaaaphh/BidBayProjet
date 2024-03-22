import { Token } from "./types";

declare module 'express-serve-static-core' {
    interface Request {
        user?: Token;
    }
}