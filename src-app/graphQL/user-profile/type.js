const { gql } = require("apollo-server-express");

const userProfileType = gql`
  type pencairan {
    jumlahPoin: Int!
    waktu_pengajuan: Int!
    aktif: String!
  }
  type ResponPencairan {
    code: Int
    status: String
    data: [pencairan]
  }
  type responHistory {
    code: Int
    status: String
    data: [history]
  }
  type ResponStandar {
    status: String!
    pesan: String!
    code: Int!
  }

  type ResponString {
    status: String!
    pesan: String!
    code: Int!
    data: String!
  }
  type responString {
    code: Int!
    status: String!
    data: [String!]
  }
  type history {
    judul: String
    deskripsi: String
    isKlasik: Boolean
    tglPengisian: Int
    insentif: Int
    gambarSurvei: String
    id_survei: String!
  }
  type userDetail {
    email: String!
    username: String!
  }
`;

module.exports = { userProfileType };
