const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    username: String! 
    email: String!
    password: String!
  }

  type UserList{
    id: ID!
    name: String!
    username: String! 
    email: String!
  }

  type Query {
    users: [UserList!]!
  }

  type Mutation {
    signup(name: String!, username: String!,email: String!, password: String!): String!
    login(email: String!, password: String!): String!
  }
`;

module.exports = typeDefs;
