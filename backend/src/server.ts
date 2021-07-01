import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import { Book, BookResolver } from './Books';
import './database/connect';
import sequelize from './database/connect';

const app = express();

const registerSequelize = async () => {
  sequelize.addModels([Book]);
  sequelize.sync();
};

const registerApollo = async () => {
  const schema = await buildSchema({
    resolvers: [BookResolver],
  });

  const server = new ApolloServer({ schema });

  server.applyMiddleware({ app });
};

const main = () => {
  registerSequelize();
  registerApollo();
};

main();

export default app;
