import { Request, Response } from 'express';
import knex from '../database/connection';
import ipAddress from '../config/ip';
export default class PointsController {
  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;
    const parsedItems = String(items)
      .split(',')
      .map((item) => Number(item.trim()));
    const points = await knex('points')
      .join('points_items', 'points.id', '=', 'points_items.point_id')
      .whereIn('points_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    return res.json(
      points.map((point) => {
        const image_url = `http://${ipAddress}:3333/uploads/${point.image}`;
        return {
          ...point,
          image_url,
        };
      })
    );
  }
  async create(req: Request, res: Response) {
    const {
      image,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      itens,
    } = req.body;
    const point = {
      image: req.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };
    const trx = await knex.transaction();
    const ids = await trx('points').insert(point);
    const point_id = ids[0];
    const pointItens = itens
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
        return {
          item_id,
          point_id,
        };
      });
    try {
      await trx('points_items').insert(pointItens);
      await trx.commit();
    } catch (error) {
      await trx.rollback();

      return res.status(400).json({
        message:
          'Falha na inserção na tabela point_items, verifique se os items informados são válidos',
      });
    }
    return res.json({ point_id, ...point });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const point = await knex('points').where('id', id).first();
    if (!point) {
      return res.status(400).json({ message: 'Point not found' });
    }
    const image_url = `http://${ipAddress}:3333/uploads/${point.image}`;
    const items = await knex('items')
      .join('points_items', 'items.id', '=', 'points_items.item_id')
      .where('points_items.point_id', id)
      .select('title');
    return res.json({ ...point, image_url, items });
  }
}
