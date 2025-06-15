const { gql } = require("apollo-server-express");

const authType = gql`
  type User {
    id_user: String
    email: String!
    password: String!
    verified: Boolean!
    waktu_pendaftaran: Int!
    poin: Int!
    kota: String!
    interest: [String]
    url_gambar: String!
    isAuthenticated: Boolean!
    tglLahir: Int!
  }
  type responUser {
    pesan: String!
    code: Int!
    data: User
  }
`;

module.exports = { authType };
