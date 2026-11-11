import jwt from "jsonwebtoken";
import { UserRole } from "../entities/enums/user-role.enum";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET debe configurarse con al menos 32 caracteres aleatorios");
}

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
