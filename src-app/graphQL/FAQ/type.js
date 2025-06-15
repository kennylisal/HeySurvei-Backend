const { gql } = require("apollo-server-express");

const FAQType = gql`
  type FAQ {
    id: String!
    pertanyaan: String!
    jawaban: String!
  }

  type responFAQ {
    code: Int!
    status: String!
    data: [FAQ]
  }
`;

module.exports = { FAQType };
