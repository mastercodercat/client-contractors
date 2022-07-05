import { body } from 'express-validator';

export const depositeRules = () => {
  return [body('balance').isNumeric()];
};
