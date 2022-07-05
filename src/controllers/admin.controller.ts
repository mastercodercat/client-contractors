import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { sequelize } from '../model';
import Logger from '../utils/Logger';

export const getBestProfession = async (req: Request, res: Response) => {
  const { start, end } = req.query;
  const { Profile, Job, Contract } = req.app.get('models');

  try {
    const contractors = await Profile.findAll({
      include: [
        {
          model: Contract,
          as: 'Contractor',
          include: [
            {
              model: Job,
              where: {
                [Op.and]: [
                  {
                    paymentDate: { [Op.gte]: start },
                  },
                  {
                    paymentDate: { [Op.lte]: end },
                  },
                ],
              },
              attributes: [],
            },
          ],
          attributes: [],
        },
      ],
      attributes: [
        'id',
        [sequelize.literal("firstName || ' ' || lastName"), 'fullName'],
        [sequelize.fn('sum', sequelize.col('Contractor.Jobs.price')), 'earned'],
      ],
      group: ['Contractor.ContractorId'],
      order: [[sequelize.col('earned'), 'desc']],
    });

    if (contractors.length <= 0) {
      return res.status(400).json({
        message: 'There is no best profession.',
      });
    }

    return res.status(200).json({ profession: contractors[0] });
  } catch (error) {
    Logger.error(error);

    return res.status(400).json({
      message: 'Failed to fetch best profession',
    });
  }
};

export const getBestClients = async (req: Request, res: Response) => {
  const { start, end, limit } = req.query;
  const { Profile, Job, Contract } = req.app.get('models');

  try {
    const clients = await Profile.findAll({
      include: [
        {
          model: Contract,
          as: 'Client',
          include: [
            {
              model: Job,
              where: {
                [Op.and]: [
                  {
                    paymentDate: { [Op.gte]: start },
                  },
                  {
                    paymentDate: { [Op.lte]: end },
                  },
                ],
              },
              attributes: [],
            },
          ],
          attributes: [],
        },
      ],
      attributes: [
        'id',
        [sequelize.literal("firstName || ' ' || lastName"), 'fullName'],
        [sequelize.fn('sum', sequelize.col('price')), 'paid'],
      ],
      group: ['Client.ClientId'],
      order: [[sequelize.col('paid'), 'desc']],
    });

    return res.status(200).json({
      clients: clients.slice(0, limit || 2),
    });
  } catch (error) {
    Logger.error(error);

    return res.status(400).json({
      message: 'Failed to fetch best clients',
    });
  }
};
