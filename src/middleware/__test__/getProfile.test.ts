import { Request, Response, NextFunction, Application } from 'express';
import getProfile from '../getProfile';
import app from '../../app';

describe('Get Profile middleware test', () => {
  test('failed to get profile', async () => {
    const get = (key: string) => {
      if (key === 'profile_id') {
        return '10000';
      }
      return '';
    };
    const req = { get, app: app as Application } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.end = jest.fn();

    const next = jest.fn() as NextFunction;
    await getProfile(req, res, next);
    expect((res.status as any).mock.calls[0][0]).toBe(401);
  });
});
