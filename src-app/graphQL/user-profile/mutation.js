const { gql } = require("apollo-server-express");

const userProfileMutaion = gql`
  extend type Mutation {
    #profileControler
    updatePassword(
      password: String!
      idUser: String!
      passwordLama: String!
    ): ResponStandar
    updateFoto(urlFoto: String!, idUser: String!): ResponStandar
    updateDemo(
      kota: String
      tgl: Int
      interest: [String]
      idUser: String
    ): ResponStandar
    percobaanX(kota: String, idUser: String, tgl: Int): ResponStandar
    ajukanPencairan(
      jumlah: Int!
      idUser: String!
      email: String!
    ): ResponStandar!
  }
`;

module.exports = { userProfileMutaion };
