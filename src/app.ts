import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { sequelize } from './model';
import routes from './routes';
import getProfile from './middleware/getProfile';

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);
app.use('/', getProfile, routes);

export default app;
