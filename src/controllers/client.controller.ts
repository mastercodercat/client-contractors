import { Request, Response } from 'express';
import { sequelize } from '../model';
import Logger from '../utils/Logger';

export const deposit = async (req: Request, res: Response) => {
  const { Profile, Job, Contract } = req.app.get('models');
  const { userId } = req.params;
  const { balance } = req.body;

  try {
    const client = await Profile.findOne({
      where: {
        id: userId,
      },
    });

    const totalBalance = await Job.sum('price', {
      include: [
        {
          model: Contract,
          where: {
            ClientId: userId,
          },
        },
      ],
    });

    if (totalBalance && balance > totalBalance / 4) {
      return res.status(400).json({
        message: 'Deposit value cannot be more than 25% of total jobs to pay',
      });
    }

    await sequelize.transaction(async () => {
      const updated = await Profile.update(
        {
          balance: client.balance + balance,
        },
        {
          where: {
            id: userId,
          },
        }
      );

      return updated;
    });

    return res.status(200).json({
      message: 'Deposit successfully',
    });
  } catch (error) {
    Logger.error(error);

    return res.status(400).json({
      message: 'Failed to deposit',
    });
  }
};
