import jwt from "jsonwebtoken";
import { UserRole } from "../entities/enums/user-role.enum";

/** Hardcoded secret for thesis project ease. In PROD use env.JWT_SECRET */
const JWT_SECRET = "super-secret-thesis-token-string-2024";

interface JwtPayload {
  userId: string;
  role: UserRole;
  sessionToken: string;
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
