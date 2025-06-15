const { gql } = require("apollo-server-express");

const authQueries = gql`
  extend type Query {
    #AuthController
    kirimEmail(email: String!, idUser: String!): ResponStandar!
    masukUser(email: String!, password: String!): ResponLogin #ini yg dipakai
    userData(idUser: String!): ResponUser
    getUserData(idUser: String!): responUserData
    #google SignIn
    masukUserGoogle(
      email: String!
      urlGambar: String!
      username: String
    ): ResponLogin!
  }
`;

module.exports = { authQueries };
