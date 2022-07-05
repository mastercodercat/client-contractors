import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { sequelize } from '../model';
import Logger from '../utils/Logger';

export const getUnpaidJobs = async (req: Request, res: Response) => {
  const { Job, Profile, Contract } = req.app.get('models');
  const profile = req.profile as typeof Profile;

  try {
    const jobs = await Job.findAll({
      include: [
        {
          model: Contract,
          where: {
            [Op.or]: [{ ClientId: profile.id }, { ContractorId: profile.id }],
            status: 'in_progress',
          },
        },
      ],
    });

    return res.status(200).json(jobs);
  } catch (error) {
    Logger.error(error);

    return res.status(400).json({
      message: 'Failed to fetch unpaid jobs',
    });
  }
};

export const payForJob = async (req: Request, res: Response) => {
  const { Job, Profile, Contract } = req.app.get('models');
  const profile = req.profile as typeof Profile;
  const { job_id } = req.params;

  try {
    const job = await Job.findOne({
      where: {
        id: job_id,
      },
      include: [{ model: Contract }],
    });

    if (job.Contract.ClientId !== profile.id) {
      return res.status(403).json({
        message: 'This job does not belong to the profile',
      });
    }

    if (job.paid) {
      return res.status(400).json({
        message: 'This job was already paid',
      });
    }

    if (profile.balance < job.price) {
      return res.status(400).json({
        message: 'Your balance is not enough to pay',
      });
    }

    await sequelize.transaction(async () => {
      const updated = await Job.update(
        {
          paid: true,
          paymentDate: new Date(),
        },
        {
          where: {
            id: job_id,
          },
        }
      );
      await Profile.update(
        {
          balance: profile.balance - job.price,
        },
        {
          where: {
            id: profile.id,
          },
        }
      );
      await Profile.update(
        {
          balance: profile.balance + job.price,
        },
        {
          where: {
            id: job.Contract.ContractorId,
          },
        }
      );

      return updated;
    });

    return res.status(200).json({
      message: 'Paid for the job successfully',
    });
  } catch (error) {
    Logger.error(error);

    return res.status(400).json({
      message: 'Failed to pay for the job',
    });
  }
};
