import { Field, ObjectType, Resolver, Query, Arg } from 'type-graphql';

@ObjectType({ description: 'Object representing books' })
export class Book {
  @Field()
  title!: string;

  @Field()
  author?: string;
}

@Resolver(_of => Book)
export class BookResolver {
  private readonly items: Book[] = [
    {
      title: 'The Awakening',
      author: 'Kate Chopin',
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster',
    },
  ];

  @Query(_returns => Book, { nullable: true })
  async book(@Arg('title') title: string): Promise<Book | undefined> {
    return await this.items.find(book => book.title === title);
  }

  @Query(_returns => [Book], {
    description: 'Get all the books from around the world ',
  })
  async books(): Promise<Book[]> {
    return await this.items;
  }
}
