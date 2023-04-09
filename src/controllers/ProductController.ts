import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../database";

export default {
  async index(req: Request, res: Response) {
    try {
      const products = await prisma.product.findMany();
      return res.json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal server error");
    }
  },

  async create(req: Request, res: Response) {
    try {
      const createProductRequestBody = z.object({
        name: z.string(),
        price: z.number(),
      });

      const { name, price } = createProductRequestBody.parse(req.body);

      const product = await prisma.product.create({
        data: {
          name,
          price,
        },
      });

      return res.status(201).json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal server error");
    }
  },

  async update(req: Request, res: Response) {
    try {

      return res.json();
    } catch (error) {
      console.error(error);
      return res.status(500).json('Internal server error');
    }
  },

  async delete(req: Request, res: Response) {},
};
