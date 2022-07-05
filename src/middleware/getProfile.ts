import { Request, Response, NextFunction } from 'express';

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { Profile } = req.app.get('models');
  const profile = await Profile.findOne({
    where: { id: req.get('profile_id') || 0 },
  });

  if (!profile) return res.status(401).end();

  req.profile = profile;
  next();
};

export default getProfile;
