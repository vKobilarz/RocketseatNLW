import { Request, Response } from 'express';

import knex from '../database/connection';
import IController from '../interfaces/KnexController';

class PointsController implements IController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const points = await knex('points')
      .select('points.*')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct();
    return response.json(points);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return response
        .status(400)
        .json({ error: `Point with ID ${id} not found` });
    }

    const items = await knex('items')
      .select('items.title')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id);

    return response.json({ ...point, items });
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const trx = await knex.transaction();

    const point = {
      image:
        'https://images.unsplash.com/photo-1554486855-60050042cd53?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const [point_id] = await trx('points').insert(point);

    const pointItems = items.map((item_id: number) => ({
      item_id,
      point_id,
    }));

    await trx('point_items').insert(pointItems);

    await trx.commit();

    return response.json({
      id: point_id,
      ...point,
    });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const trx = await knex.transaction();

    const point = await trx('points').where('id', id).first();

    if (!point) {
      return response
        .status(400)
        .json({ error: `Point with ID ${id} not found` });
    }

    const pointCreated = {
      image:
        'https://images.unsplash.com/photo-1554486855-60050042cd53?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    await trx('items').update(pointCreated).where('id', id);

    await trx.commit();

    return response.json({ id, ...pointCreated });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const trx = await knex.transaction();

    const point = await trx('points').where('id', id).first();

    if (!point) {
      return response
        .status(400)
        .json({ error: `Point with ID ${id} not found` });
    }

    await trx('point_items').delete().where('point_id', id);
    await trx('points').delete().where('id', id);

    await trx.commit();

    return response.json();
  }
}

export default new PointsController();
