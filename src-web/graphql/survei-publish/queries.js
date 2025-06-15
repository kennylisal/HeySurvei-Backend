const { gql } = require("apollo-server-express");

const publishingQueries = gql`
  extend type Query {
    broadcastPengerjaanSurvei(
      listEmail: [String]!
      judul: String!
      link: String!
    ): ResponStandar!

    #surveiController
    getAllInterest: responString!
    getAllKota: responString!
    getAllKategori: responDataKategori
    getPublishData(idForm: String!, tipe: String!): ResponPublishData!
    getReward: responReward
  }
`;

module.exports = { publishingQueries };
