import { ExpressContext } from 'apollo-server-express';
import {
  Column,
  CreatedAt,
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
} from 'type-graphql';

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
}
