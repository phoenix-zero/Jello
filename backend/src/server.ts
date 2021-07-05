import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import { Book, BookResolver } from './models/Books';
import { User, UserResolver } from './models/User';
import './database/connect';
import sequelize from './database/connect';

const app = express();

const registerSequelize = async () => {
  sequelize.addModels([Book, User]);
  sequelize.sync();
};

const registerApollo = async () => {
  const schema = await buildSchema({
    resolvers: [BookResolver, UserResolver],
  });

  const server = new ApolloServer({
    schema,
    tracing: process.env.NODE_ENV !== 'production',
    context: obj => obj,
  });

  server.applyMiddleware({ app });
};

const main = () => {
  registerSequelize();
  registerApollo();
};

main();

export default app;
