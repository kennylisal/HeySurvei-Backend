const { gql } = require("apollo-server-express");

const authQueries = gql`
  extend type Query {
    loginUser(email: String!, password: String!): ResponString!
    loginGoogle(email: String!): ResponStandar!
    getDataUser(idUser: String!): responUser
    kirimSMS: ResponStandar
  }
`;

module.exports = { authQueries };
