import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Field, Int, ObjectType } from 'type-graphql';
import { List } from './List';

@ObjectType('Task', { description: 'Represents a Jello Task' })
@Table({ modelName: 'Task' })
export class Task extends Model {
  @Field(_returns => Int)
  get taskId(): number {
    return this.id;
  }

  @Field()
  @Column
  title!: string;

  @Field()
  @Column
  description!: string;

  @Field()
  @Column
  deadline!: Date;

  @ForeignKey(_table => List)
  @Column(DataType.INTEGER)
  list!: List;
}
