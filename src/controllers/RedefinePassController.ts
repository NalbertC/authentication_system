import crypto from "crypto";
import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../database";
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

  async reset(req: Request, res: Response) {},
};
