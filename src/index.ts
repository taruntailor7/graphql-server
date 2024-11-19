import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";
import { makeExecutableSchema } from "@graphql-tools/schema";

const prisma = new PrismaClient();

// GraphQL Schema
const typeDefs = `
  type User {
    id: Int!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users: async () => await prisma.user.findMany(),
  },
  Mutation: {
    createUser: async (_: any, args: { name: string; email: string }) =>
      await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
        },
      }),
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create GraphQL server using GraphQLServer
const yoga = createYoga({
  schema,
});

// Create HTTP server
const server = createServer(yoga)

// Start server
server.listen(4000, () => {
  console.log('GraphQL server is running on http://localhost:4000')
})

