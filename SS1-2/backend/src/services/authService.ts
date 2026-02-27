import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { dbPool } from "../config/db";
import { JwtUser } from "../types/jwt";

const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(8)
});

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return secret;
};

export type LoginInput = z.infer<typeof loginSchema>;

export const validateLoginInput = (input: unknown): LoginInput => {
  return loginSchema.parse(input);
};

export interface AuthUser {
  userId: string;
  username: string;
  role: string;
}

export const authenticateUser = async (
  input: LoginInput
): Promise<string | null> => {
  const client = await dbPool.connect();

  try {
    const query = `
      SELECT user_id, username, password_hash, role, status
      FROM user_account
      WHERE username = $1
    `;

    const result = await client.query(query, [input.username]);
    const row = result.rows[0];

    if (!row) {
      return null;
    }

    if (row.status !== "ACTIVE") {
      return null;
    }

    const passwordsMatch = await bcrypt.compare(
      input.password,
      row.password_hash
    );

    if (!passwordsMatch) {
      return null;
    }

    const payload: JwtUser = {
      userId: row.user_id,
      role: row.role
    };

    const token = jwt.sign(payload, getJwtSecret(), {
      expiresIn: "8h"
    });

    return token;
  } finally {
    client.release();
  }
};

export const getUserById = async (userId: string): Promise<AuthUser | null> => {
  const client = await dbPool.connect();

  try {
    const query = `
      SELECT user_id, username, role
      FROM user_account
      WHERE user_id = $1
    `;

    const result = await client.query(query, [userId]);
    const row = result.rows[0];

    if (!row) {
      return null;
    }

    return {
      userId: row.user_id,
      username: row.username,
      role: row.role
    };
  } finally {
    client.release();
  }
};

