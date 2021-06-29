import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import { BookResolver } from './Books';

const app = express();

const main = async () => {
  const schema = await buildSchema({
    resolvers: [BookResolver],
  });

  const server = new ApolloServer({ schema });

  server.applyMiddleware({ app });
};

main();

export default app;
