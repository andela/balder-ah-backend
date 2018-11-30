import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from '../docs/swagger';

module.exports = (app) => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(morgan('dev'));
  app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
};
