import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { authConfig } from "../configs/authConfig";

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json("Token is missing");
  }

  const [, token] = authToken.split(" ");

  try {
    verify(token, authConfig.secret);

    return next();
  } catch (error) {
    return res.status(401).json("Token invalid");
  }
}
