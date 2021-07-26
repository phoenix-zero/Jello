import { ExpressContext } from 'apollo-server-express';
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import {
  Arg,
  Field,
  InputType,
  ObjectType,
  Query,
  Resolver,
  Mutation,
  Ctx,
  registerEnumType,
  Subscription,
  PubSub,
  Root,
  UseMiddleware,
  Publisher,
  ResolverFilterData,
} from 'type-graphql';
import AuthMiddleware from '../middleware/Auth';
import { SocketContext } from './types';

enum ThemePreference {
  light = 'light',
  dark = 'dark',
  system = 'system',
}

registerEnumType(ThemePreference, {
  name: 'ThemePreference',
  description: "User's choice of theme",
});

type UserTheme = { theme: ThemePreference; user: number };

@ObjectType('User', { description: 'Represents a Jello user' })
@Table({ modelName: 'User' })
export class User extends Model {
  @Field(_returns => String)
  get userId(): string {
    return this.id;
  }

  @Field()
  @Column
  name!: string;

  @Field()
  @Unique
  @Column
  email!: string;

  @Field()
  @Column
  picture!: string;

  @Field()
  @Column
  @CreatedAt
  createdAt!: Date;

  @Field()
  @Column
  @UpdatedAt
  updatedAt!: Date;

  @Field(_type => ThemePreference)
  @Column({
    type: DataType.ENUM({ values: Object.keys(ThemePreference) }),
    defaultValue: 'system',
  })
  theme!: ThemePreference;
}
@InputType()
export class UserInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  picture?: string;
}

@Resolver(_of => User)
export class UserResolver {
  @Query(_returns => User, { nullable: true })
  async user(@Arg('email') email: string): Promise<Optional<User>> {
    return await User.findOne({
      where: {
        email,
      },
    });
  }

  @Query(_returns => User, { nullable: true })
  async currentUser(@Ctx() context: ExpressContext): Promise<Optional<User>> {
    return context.req.user;
  }

  @Mutation(_returns => User, { nullable: true })
  async updateUser(@Arg('user') _user: UserInput): Promise<Optional<User>> {
    return null;
  }

  @Mutation(_returns => User, { nullable: true })
  @UseMiddleware(AuthMiddleware)
  async updateUserTheme(
    @Arg('theme', _returns => ThemePreference) theme: ThemePreference,
    @Ctx() context: ExpressContext,
    @PubSub('THEME_CHANGE')
    publish: Publisher<UserTheme>,
  ): Promise<Optional<User>> {
    const user = context.req.user!;

    user.theme = theme;
    user.save();

    publish({ theme, user: user.id });

    return user;
  }

  @Subscription(_returns => ThemePreference, {
    topics: 'THEME_CHANGE',
    filter: ({
      context,
      payload,
    }: ResolverFilterData<UserTheme, undefined, SocketContext>) => {
      return context.connection?.context?.req.user?.id === payload.user;
    },
  })
  async userTheme(
    @Root() { theme }: UserTheme,
  ): Promise<Optional<ThemePreference>> {
    return theme;
  }
}
