import { Request, Response } from 'express';
import ipAddress from '../config/ip';
import knex from '../database/connection';
export default class ItemsController {
  async index(req: Request, res: Response) {
    const itens = await knex('items').select('*');
    const serializedItens = itens.map((item) => {
      return {
        ...item,
        image_url: `http://${ipAddress}:3333/uploads/${item.image}`,
      };
    });
    return res.json(serializedItens);
  }
}
