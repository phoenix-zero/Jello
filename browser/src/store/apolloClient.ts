import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const link = ApolloLink.from([
  split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    new WebSocketLink({
      uri: `${import.meta.env.VITE_WS_URL}/graphql`,
      options: { reconnect: true },
    }),
    new HttpLink({
      uri: `${import.meta.env.VITE_API_URL}/graphql`,
      credentials: 'include',
    }),
  ),
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
