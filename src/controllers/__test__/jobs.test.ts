import { Request, Response, Application } from 'express';
import { Params } from 'express-serve-static-core';
import { getUnpaidJobs, payForJob } from '../jobs.controller';
import app from '../../app';

const { Profile } = app.get('models');

let profile: typeof Profile;

describe('Test Job endpoints', () => {
  beforeEach(async () => {
    profile = await Profile.findOne({
      where: {
        id: '1',
      },
    });
  });

  test('testing to get unpaid jobs', async () => {
    const req = { profile, app: app as Application } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    await getUnpaidJobs(req, res);
    expect((res.status as any).mock.calls[0][0]).toBe(200);
  });

  test('failed to pay with wrong client id(403 error)', async () => {
    const params: Params = {
      job_id: '3',
    };
    const req = { params, profile, app: app as Application } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    await payForJob(req, res);
    expect((res.status as any).mock.calls[0][0]).toBe(403);
    expect((res.json as any).mock.calls[0][0].message).toBe('This job does not belong to the profile');
  });

  test('failed to pay if it was already paid(400 error)', async () => {
    const params: Params = {
      job_id: '2',
    };
    const req = { params, profile, app: app as Application } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    await payForJob(req, res);
    expect((res.status as any).mock.calls[0][0]).toBe(400);
    expect((res.json as any).mock.calls[0][0].message).toBe('This job was already paid');
  });
});
