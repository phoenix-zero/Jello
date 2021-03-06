import { Column, Model, Table, Unique } from 'sequelize-typescript';
import {
  Arg,
  Field,
  InputType,
  ObjectType,
  Query,
  Resolver,
  Mutation,
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
  get created(): Date {
    return this.createdAt;
  }

  @Field()
  get updated(): Date {
    return this.updatedAt;
  }
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
  async user(@Arg('email') email: string): Promise<User | null> {
    return await User.findOne({
      where: {
        email,
      },
    });
  }

  @Mutation(_returns => User, { nullable: true })
  async updateUser(@Arg('user') _user: UserInput): Promise<User | null> {
    return null;
  }
}
