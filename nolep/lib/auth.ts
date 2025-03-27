// lib/auth.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const comparePasswords = (plain: string, hashed: string) =>
  bcrypt.compare(plain, hashed);
export const generateToken = (userId: number) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });
