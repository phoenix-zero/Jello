import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';

const link = ApolloLink.from([
  createHttpLink({
    uri: `${import.meta.env.VITE_API_URL}/graphql`,
    credentials: 'include',
  }),
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
