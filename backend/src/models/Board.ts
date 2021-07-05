import { Column, Model, Table } from 'sequelize-typescript';
import { Arg, Field, Int, ObjectType, Query, Resolver } from 'type-graphql';
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
  @Column
  description!: string;
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
}
