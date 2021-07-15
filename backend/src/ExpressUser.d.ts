declare namespace Express {
  import('./models/User');
  import { User as UserModel } from './models/User';

  export type User = UserModel;
}

declare type Optional<T> = T | undefined | null;
