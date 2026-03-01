import { JwtUser } from "./jwt";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtUser;
  }
}

