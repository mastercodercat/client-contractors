import { ParsedQs } from 'qs';
import { Request, Response, Application } from 'express';
import { getBestClients, getBestProfession } from '../admin.controller';
import app from '../../app';

describe('Get best profession and clients', () => {
  test('testing to get best profession', async () => {
    const query: ParsedQs = {
      start: '2020-05-01',
      end: '2020-09-01',
    };
    const req = { query, app: app as Application } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    await getBestProfession(req, res);
    expect((res.status as any).mock.calls[0][0]).toBe(200);
  });

  test('testing to get best clients', async () => {
    const query: ParsedQs = {
      start: '2020-05-01',
      end: '2020-09-01',
      limit: '3',
    };
    const req = { query, app: app as Application } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    await getBestClients(req, res);
    expect((res.status as any).mock.calls[0][0]).toBe(200);
    expect((res.json as any).mock.calls[0][0].clients.length).toBe(3);
  });
});
