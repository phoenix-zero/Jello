import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Field, ObjectType } from 'type-graphql';
import { Board } from './Board';

@ObjectType('List', { description: 'Represents a Jello List' })
@Table({ modelName: 'List' })
export class List extends Model {
  @Field(_returns => String)
  get listId(): string {
    return this.id;
  }

  @Field()
  @Column
  title!: string;

  @Field()
  @Column
  color!: string;

  @Field(_returns => Board)
  @BelongsTo(_table => Board, 'id')
  board!: Board;
}
