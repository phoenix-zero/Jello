import {
  Column,
  CreatedAt,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import {
  Arg,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { List } from './List';

@ObjectType('Board', { description: 'Represents a Jello board' })
@Table({ modelName: 'Board' })
export class Board extends Model {
  @Field(_returns => Int)
  get boardId(): number {
    return this.id;
  }

  @Field()
  @Column
  title!: string;

  @Field()
  @Column({ defaultValue: '' })
  description!: string;

  @Field(_returns => [List])
  @HasMany(_values => List)
  lists!: List[];

  @Field()
  @Column
  @CreatedAt
  createdAt!: Date;

  @Field()
  @Column
  @UpdatedAt
  updatedAt!: Date;
}

@Resolver(_of => Board)
export class BoardResolver {
  @Query(_returns => Board, { nullable: true })
  async board(@Arg('boardId') id: number): Promise<Board | null> {
    return await Board.findOne({
      where: {
        id,
      },
      include: [List],
    });
  }

  @Mutation(_returns => Board, { nullable: true })
  async addBoard(
    @Arg('title') title: string,
    @Arg('description', { nullable: true }) description: string,
  ): Promise<Board | null> {
    const board = await Board.create({
      title,
      description,
    });
    return board;
  }
}
