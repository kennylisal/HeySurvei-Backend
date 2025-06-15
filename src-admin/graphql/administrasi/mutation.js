const { gql } = require("apollo-server-express");

const administrasiMutation = gql`
  extend type Mutation {
    banUser(idUser: String!, status: Boolean!): ResponStandar

    updateReward(
      insentif: Int!
      hargaSurvei: Int!
      special: Int!
    ): ResponStandar

    setSurveiStatus(idSurvei: String!, status: String!): ResponStandar!

    ajukanPenghapusan(
      email: String
      password: String
      pesan: String
      lupa: Int
    ): ResponStandar!

    updatePencairan(
      idPencairan: String!
      status: String!
      idUser: String!
      poin: Int!
    ): ResponStandar!

    updatePencairanSurveyor(
      idPencairan: String!
      status: String!
      idUser: String!
      poin: Int!
    ): ResponStandar!

    hapusKategori(idKategori: String!): ResponStandar

    updateKategori(idKategori: String!, nama: String!): ResponStandar

    buatKategori(nama: String!, idKategori: String!): ResponStandar
  }
`;

module.exports = { administrasiMutation };
