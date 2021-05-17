

const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [bookSchema]
  }

  type Query {
    users: [User]
  }

  type Book {
      bookId: ID
      authors: [authors]
      description: String
      title: String
      image: String
      link: String
  }

  type Auth {
      token: ID!
      user: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(authors: [author], description: String!, title: String!, bookId: ID!, image: String!, link: String!): User
    removeBook(bookId: ID): User
  }


`;

module.exports = typeDefs;
