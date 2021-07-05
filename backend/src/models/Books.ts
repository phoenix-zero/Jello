import { Field, ObjectType, Resolver, Query, Arg } from 'type-graphql';
import { Table, Column, Model } from 'sequelize-typescript';

@ObjectType('Book', { description: 'Object representing books' })
@Table({ modelName: 'Book' })
export class Book extends Model {
  @Field()
  @Column
  title!: string;

  @Field()
  @Column
  author?: string;

  @Field(() => Date)
  get created(): Date {
    return this.createdAt;
  }
}

@Resolver(_of => Book)
export class BookResolver {
  @Query(_returns => Book, { nullable: true })
  async book(@Arg('title') title: string): Promise<Book | null> {
    return await Book.findOne({
      where: {
        title,
      },
    });
  }

  @Query(_returns => [Book], {
    description: 'Get all the books from around the world ',
  })
  async books(): Promise<Book[]> {
    return await Book.findAll();
  }
}
