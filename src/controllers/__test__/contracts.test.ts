import { Request, Response, Application } from 'express';
import { Params } from 'express-serve-static-core';
import { getContractList, getContract } from '../contracts.controller';
import app from '../../app';

const { Profile } = app.get('models');

let profile: typeof Profile;

describe('Get contract list or contract by id', () => {
  beforeEach(async () => {
    profile = await Profile.findOne({
      where: {
        id: '1',
      },
    });
  });

  test('testing to get contract list', async () => {
    const req = { profile, app: app as Application } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    await getContractList(req, res);
    expect((res.status as any).mock.calls[0][0]).toBe(200);
  });

  test('testing to get contract by id', async () => {
    const params: Params = {
      id: '2',
    };
    const req = { params, profile, app: app as Application } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    await getContract(req, res);
    expect((res.status as any).mock.calls[0][0]).toBe(200);
  });

  test('404 error with no contract id', async () => {
    const params: Params = {
      id: '100000',
    };
    const req = { params, profile, app: app as Application } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    await getContract(req, res);
    expect((res.status as any).mock.calls[0][0]).toBe(404);
  });

  test('403 error with unaccessible id', async () => {
    const params: Params = {
      id: '3',
    };
    const req = { params, profile, app: app as Application } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    await getContract(req, res);
    expect((res.status as any).mock.calls[0][0]).toBe(403);
  });
});
