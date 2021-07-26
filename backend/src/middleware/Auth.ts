import { AuthenticationError, ExpressContext } from 'apollo-server-express';
import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';

class AuthMiddleware implements MiddlewareInterface<ExpressContext> {
  async use(
    { context }: ResolverData<ExpressContext>,
    next: NextFn,
  ): Promise<unknown> {
    const user = context.req.user;
    if (!user) throw new AuthenticationError('Not signed in for operation');
    return next();
  }
}

export default AuthMiddleware;
