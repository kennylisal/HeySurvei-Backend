const { gql } = require("apollo-server-express");

const authMutation = gql`
  extend type Mutation {
    #profileController
    updateUsername(username: String!, idUser: String!): ResponStandar
    updatePassword(
      password: String!
      idUser: String!
      passwordLama: String!
    ): ResponStandar
    updateFoto(urlFoto: String!, idUser: String!): ResponStandar

    #authController
    registerUser(user: AddUserInput!): ResponStandar #ini yg dipakai
    registerEx(email: String!, username: String!): ResponStandar #ini yg dipakai
    registerExPass(
      email: String!
      username: String!
      password: String!
    ): ResponStandar #ini yg dipakai
    registerAp(email: String!): ResponStandar
    registerApPass(email: String!, password: String!): ResponStandar
    ubahTanggalMasuk(idSurvei: String!): ResponStandar
  }
`;

module.exports = { authMutation };
