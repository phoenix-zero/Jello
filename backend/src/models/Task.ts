import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Field, ObjectType } from 'type-graphql';
import { List } from './List';

@ObjectType('Task', { description: 'Represents a Jello Task' })
@Table({ modelName: 'Task' })
export class Task extends Model {
  @Field(_returns => String)
  get taskId(): string {
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

  @Field(_returns => List)
  @BelongsTo(_table => List, 'id')
  list!: List;
}
