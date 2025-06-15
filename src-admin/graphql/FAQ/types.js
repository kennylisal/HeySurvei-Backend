const { gql } = require("apollo-server-express");
const FAQTypeDefs = gql`
  type responFAQ {
    code: Int!
    status: String!
    data: [FAQ]
  }

  type FAQ {
    id: String!
    pertanyaan: String!
    jawaban: String!
  }
  type ResponStandar {
    status: String!
    data: String!
    code: Int!
  }
`;

module.exports = { FAQTypeDefs };
