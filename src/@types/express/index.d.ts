import { Profile } from '../../model';

declare global {
  namespace Express {
    interface Request {
      profile?: any;
    }
  }
}
