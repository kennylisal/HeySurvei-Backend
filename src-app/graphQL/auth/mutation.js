const { gql } = require("apollo-server-express");

const authMutation = gql`
  extend type Mutation {
    #AuthController
    registerUser(email: String!, password: String!): ResponStandar!
    registerUserGoogle(email: String!, urlGambar: String!): ResponString!

    #autentikasi tambaha
    kirimSmsAuth(idUser: String, noHP: String!): ResponStandar!
    autentikasiKodeSms(kode: String!, idUser: String!): ResponStandar!
  }
`;

module.exports = { authMutation };
