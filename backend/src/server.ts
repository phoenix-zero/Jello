import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { exit } from 'process';

import { User, UserResolver } from './models/User';
import './database/connect';
import sequelize from './database/connect';
import { Board, BoardResolver } from './models/Board';
import { List } from './models/List';
import { Task } from './models/Task';
import auth from './auth';

const app = express();

const { COOKIE_SECRET, ALLOW_ORIGIN } = process.env;
if (!COOKIE_SECRET || !ALLOW_ORIGIN) exit(-1);

const corsOptions = {
  origin: ALLOW_ORIGIN,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: COOKIE_SECRET,
    saveUninitialized: true,
    resave: true,
  }),
);
app.use(cookieParser(COOKIE_SECRET));

auth(app);

const registerSequelize = async () => {
  sequelize.addModels([User, Board, List, Task]);
  sequelize.sync();
};

const registerApollo = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver, BoardResolver],
  });

  const server = new ApolloServer({
    schema,
    tracing: process.env.NODE_ENV !== 'production',
    playground: {
      settings: {
        'request.credentials': 'include',
      },
    },
    context: obj => obj,
  });

  server.applyMiddleware({ app, cors: corsOptions });
};

registerSequelize();
registerApollo();

export default app;
