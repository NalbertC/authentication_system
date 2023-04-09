import crypto from "crypto";
import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../database";
import { encriptPassword } from "../services/auth";
import mailer from "../services/mail";

export default {
  async forgot(req: Request, res: Response) {
    try {
      const forgotPassBody = z.object({
        email: z.string(),
      });
      const { email } = forgotPassBody.parse(req.body);
      const verifyEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!verifyEmail) {
        return res.status(400).json("Email does notexists");
      }
      const token = crypto.randomBytes(20).toString("hex");

      const dateExpirationToken = new Date();
      dateExpirationToken.setHours(dateExpirationToken.getHours() + 1);

      const saveToken = await prisma.user.update({
        where: {
          id: verifyEmail.id,
        },
        data: {
          tokenResetPass: token,
          dateExpirationToken,
        },
      });

      await mailer.emailRecoveryPass(saveToken.email, token);

      console.log(token, saveToken.dateExpirationToken);

      return res.status(200).json("Check your email");
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal server error");
    }
  },

  async reset(req: Request, res: Response) {
    try {
      const redefinePassBody = z.object({
        email: z.string(),
        password: z.string(),
      });

      const tokenValidationParams = z.object({
        token: z.string(),
      });

      const { email, password } = redefinePassBody.parse(req.body);
      const { token } = tokenValidationParams.parse(req.params);

      const verifyEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!verifyEmail) {
        return res.status(404).json("User does not exists");
      }

      if (token !== verifyEmail.tokenResetPass) {
        return res.status(401).json("Invalid token");
      }

      const now = new Date();

      if (now > verifyEmail.dateExpirationToken) {
        return res
          .status(401)
          .json("Expired token, generate new token on forgot password");
      }

      const encriptedPass = await encriptPassword(password);

      await prisma.user.update({
        where: {
          id: verifyEmail.id,
        },
        data: {
          password: encriptedPass,
        },
      });

      return res.status(200).json("Successfully updated password");
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal server error");
    }
  },
};
