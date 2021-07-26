import { ExpressContext } from 'apollo-server-express';

export type SocketContext = {
  connection?: {
    context?: ExpressContext;
  };
};
