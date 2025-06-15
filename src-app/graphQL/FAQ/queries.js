const { gql } = require("apollo-server-express");

const FAQQueries = gql`
  extend type Query {
    getFAQ: responFAQ
  }
`;

module.exports = { FAQQueries };
