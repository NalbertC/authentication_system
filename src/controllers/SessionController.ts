import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { z } from "zod";
import { authConfig } from "../configs/authConfig";
import { prisma } from "../database";
import { comparePassword } from "../services/auth";

export default {
  async create(req: Request, res: Response) {
    try {
      const userLoginRequestBody = z.object({
        username: z.string(),
        password: z.string(),
      });

      const { username, password } = userLoginRequestBody.parse(req.body);

      const userAlreadExists = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      // verificar se usuario existe
      if (!userAlreadExists) {
        return res.status(400).json("User or password incorrect");
      }

      // verificar se a senha esta correta
      const verifyPassword = await comparePassword(
        password,
        userAlreadExists.password
      );

      if (!verifyPassword) {
        return res.status(400).json("User or password incorrect");
      }

      // gerar token do usuario

      const token = sign({}, authConfig.secret, {
        subject: String(userAlreadExists.id),
        expiresIn: authConfig.expiresIn,
      });

      return res.status(201).json({
        user: {
          id: userAlreadExists.id,
          username: userAlreadExists.username,
        },
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal server error");
    }
  },
};
