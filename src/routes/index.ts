import express from 'express';

import { getContract, getContractList } from '../controllers/contracts.controller';
import { getUnpaidJobs, payForJob } from '../controllers/jobs.controller';
import { deposit } from '../controllers/client.controller';
import { getBestClients, getBestProfession } from '../controllers/admin.controller';

import { depositeRules } from '../utils/rules';
import { validate } from '../middleware/validation';

const routes = express.Router();

routes.get('/contracts', getContractList);
routes.get('/contracts/:id', getContract);
routes.get('/jobs/unpaid', getUnpaidJobs);
routes.post('/jobs/:job_id/pay', payForJob);
routes.post('/balances/deposit/:userId', depositeRules(), validate, deposit);
routes.get('/admin/best-profession', getBestProfession);
routes.get('/admin/best-clients', getBestClients);

export default routes;
