import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import { User, UserResolver } from './models/User';
import './database/connect';
import sequelize from './database/connect';
import { Board, BoardResolver } from './models/Board';
import { List } from './models/List';
import { Task } from './models/Task';

const app = express();

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
    context: obj => obj,
  });

  server.applyMiddleware({ app });
};

registerSequelize();
registerApollo();

export default app;
