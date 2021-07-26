import 'reflect-metadata';
import express, { Response, Request } from 'express';
import http from 'http';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { exit } from 'process';

import sequelize from './database/connect';

import { User, UserResolver } from './models/User';
import { Board, BoardResolver } from './models/Board';
import { List } from './models/List';
import { Task } from './models/Task';
import auth from './auth';
import passport from 'passport';

const app = express();

const { COOKIE_SECRET, ALLOW_ORIGIN } = process.env;
if (!COOKIE_SECRET || !ALLOW_ORIGIN) exit(-1);

const corsOptions = {
  origin: ALLOW_ORIGIN,
  credentials: true,
};

const sessionMiddleware = session({
  secret: COOKIE_SECRET,
  saveUninitialized: true,
  resave: true,
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(cookieParser(COOKIE_SECRET));

auth(app);

const httpServer = http.createServer(app);

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
    subscriptions: {
      onConnect(_, ws) {
        const socket = ws as unknown as WebSocket & { upgradeReq: Request };
        return new Promise(resolve =>
          sessionMiddleware(socket.upgradeReq, {} as Response, () =>
            passport.initialize()(socket.upgradeReq, {} as Response, () =>
              passport.session()(socket.upgradeReq, {} as Response, () => {
                resolve({ req: socket.upgradeReq });
              }),
            ),
          ),
        );
      },
    },
  });

  server.applyMiddleware({ app, cors: corsOptions });
  server.installSubscriptionHandlers(httpServer);
};

registerSequelize();
registerApollo();

export default httpServer;
