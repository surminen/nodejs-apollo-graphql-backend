import { json } from "body-parser";

const { ApolloServer, gql } = require('apollo-server');

// Some fake data to start with
const uris = [
  {
    uri: `http://google.com`,
    status: false,
    lastchecked: null,
  },
  {
    uri: `http://google.com.au`,
    status: false,
    lastchecked: null,
  },
  {
    uri: `http://foobar-fakeuri.com`,
    status: false,
    lastchecked: null,
  },
];

// The GraphQL schema in string form
const typeDefs = gql`
  type Uri { 
    uri: String!, status: Boolean, lastchecked: Int 
  }
  input UriInput { 
    uri: String status: Boolean lastchecked: Int 
  }
  type Query { 
    uris: [Uri] 
  }
  type Mutation {
    createUri(input: UriInput!): Uri
    updateUri(input: UriInput!): Uri
  }
`;

// The resolvers
const resolvers = {
  Query: { uris: () => uris },
  Mutation: {
    createUri: (parent: any, args: any, context: any, info: any) => {
      const item = {
        uri: args.input.uri,
        status: args.input.status,
        lastchecked: args.input.lastchecked,
      }
      uris.push(item);
      return (item);
    },
    updateUri: (parent: any, args: any, context: any, info: any) => {
      const item = {
        uri: args.input.uri,
        status: args.input.status,
        lastchecked: args.input.lastchecked,
      }
      const index = uris.indexOf(item.uri);
      uris.splice(index, 1, item);
      return (item);
    }
  },
};


const server = new ApolloServer({ typeDefs, resolvers, introspection: true, playground: true });

// Start the server
const port = process.env.PORT || 8080;
server.listen(port).then(({ url }: { url: string }) => {
  console.log(`Go to ${url} to run queries!`);
});
