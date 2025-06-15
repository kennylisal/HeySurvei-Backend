const { gql } = require("apollo-server-express");

const authType = gql`
  input userDataInput {
    username: String!
    password: String!
    urlGambar: String!
    idUser: String!
  }
  input AddUserInput {
    username: String!
    email: String!
    password: String!
    verified: Int!
    idUser: String!
  }
  type userData {
    idUser: String!
    username: String!
    urlGambar: String!
    email: String!
    poin: Int!
  }

  type responUserData {
    code: Int!
    status: String!
    data: userData
  }
  type UserApp {
    email: String!
    password: String!
    tgl_lahir: String!
    interest: [String!]
    verified: Int! #angka menandakan dia di-tahap mana dalam verifikasi
    kota: String!
    insentif: Int!
  }
  type ResponUser {
    code: Int!
    status: String!
    data: User!
  }
  type User {
    idUser: String
    username: String!
    email: String!
    password: String!
    verified: Int!
    waktu_pendaftaran: String!
    urlGambar: String!
  }
`;

module.exports = { authType };
