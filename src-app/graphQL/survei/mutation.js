const { gql } = require("apollo-server-express");

const surveiMutations = gql`
  extend type Mutation {
    reportSurvei(
      idSurvei: String!
      idUser: String!
      pesan: String
    ): ResponStandar!
    kirimReport(
      laporan: String!
      email: String!
      idUser: String!
      idSurvei: String!
      judulSurvei: String!
    ): ResponStandar!

    #Kirim Penilaian
    kirimPenilaianSurvei(
      pesan: String!
      nilai: Int!
      idSurvei: String!
      email: String!
      idUser: String!
    ): ResponStandar!
  }
`;

module.exports = { surveiMutations };
