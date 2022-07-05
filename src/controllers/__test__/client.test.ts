import { Request, Response, Application } from 'express';
import { Params } from 'express-serve-static-core';
import { deposit } from '../client.controller';
import app from '../../app';

describe('Deposit balance', () => {
  test('testing to deposit successfully', async () => {
    const params: Params = {
      userId: '1',
    };
    const body = {
      balance: 100,
    };
    const req = { params, body, app: app as Application } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    await deposit(req, res);
    expect((res.status as any).mock.calls[0][0]).toBe(200);
  });

  test('failed to deposit with balance error message', async () => {
    const params: Params = {
      userId: '1',
    };
    const body = {
      balance: 100000,
    };
    const req = { params, body, app: app as Application } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    await deposit(req, res);
    expect((res.status as any).mock.calls[0][0]).toBe(400);
    expect((res.json as any).mock.calls[0][0].message).toBe(
      'Deposit value cannot be more than 25% of total jobs to pay'
    );
  });
});
