const { gql } = require("apollo-server-express");

const FAQMutations = gql`
  extend type Mutation {
    hapusFAQ(idFAQ: String!): ResponStandar

    updateFAQ(
      idFAQ: String!
      pertanyaan: String!
      jawaban: String!
    ): ResponStandar

    buatFAQ(
      idFAQ: String!
      pertanyaan: String!
      jawaban: String!
    ): ResponStandar
  }
`;

module.exports = { FAQMutations };
