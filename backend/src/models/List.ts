import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Field, Int, ObjectType } from 'type-graphql';
import { Board } from './Board';
import { Task } from './Task';

@ObjectType('List', { description: 'Represents a Jello List' })
@Table({ modelName: 'List' })
export class List extends Model {
  @Field(_returns => Int)
  get listId(): number {
    return this.id;
  }

  @Field()
  @Column
  title!: string;

  @Field()
  @Column
  color!: string;

  @ForeignKey(_table => Board)
  @Column(DataType.INTEGER)
  board!: Board;

  @HasMany(_values => Task)
  tasks!: List[];

  @Field()
  @Column
  @CreatedAt
  createdAt!: Date;

  @Field()
  @Column
  @UpdatedAt
  updatedAt!: Date;
}
