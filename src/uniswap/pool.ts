import { ApolloClient, InMemoryCache } from '@apollo/client'
import {gql} from "../__generated__/gql";
import config from "../config";

export const apolloClient = new ApolloClient({
  uri: config.graphqlHost,
  cache: new InMemoryCache(),
})