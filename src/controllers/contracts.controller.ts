import { Request, Response } from 'express';
import { Op } from 'sequelize';

import Logger from '../utils/Logger';

export const getContract = async (req: Request, res: Response) => {
  const { Contract, Profile } = req.app.get('models');
  const { id } = req.params;

  try {
    const contract = await Contract.findOne({
      where: {
        id,
      },
    });

    if (!contract) {
      return res.status(404).end();
    }
    const profile = req.profile as typeof Profile;
    if (contract.ClientId !== profile?.id && contract.ContractorId !== profile?.id) {
      return res.status(403).json({
        message: 'This contract does not belong to the client.',
      });
    }

    return res.status(200).json({ contract });
  } catch (error) {
    Logger.error(error);
    return res.status(400).json({
      message: 'Failed to fetch contract by id',
    });
  }
};

export const getContractList = async (req: Request, res: Response) => {
  const { Contract, Profile } = req.app.get('models');

  try {
    const profile = req.profile as typeof Profile;
    const contracts = await Contract.findAll({
      where: {
        [Op.or]: [{ ClientId: profile.id }, { ContractorId: profile.id }],
        status: {
          [Op.ne]: 'terminated',
        },
      },
    });

    return res.status(200).json({ contracts });
  } catch (error) {
    Logger.error(error);

    return res.status(400).json({
      message: 'Failed to fetch contracts',
    });
  }
};
