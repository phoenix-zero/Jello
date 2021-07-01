import { Sequelize } from 'sequelize-typescript';
import { exit } from 'process';

const { DATABASE_PASSWORD, DATABASE_USERNAME, DATABASE_NAME, DATABASE_HOST } =
  process.env;
console.log({
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOST,
});

if (!(DATABASE_NAME && DATABASE_USERNAME && DATABASE_PASSWORD && DATABASE_HOST))
  exit(-1);

const sequelize = new Sequelize(
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  {
    host: DATABASE_HOST,
    dialect: 'postgres',
    logging: (...msg) => console.log(msg),
  },
);

sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(error => console.error('Unable to connect to the database:', error));

export default sequelize;
