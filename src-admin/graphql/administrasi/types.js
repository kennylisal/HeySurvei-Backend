const { gql } = require("apollo-server-express");

const administrasiType = gql`
  type responReward {
    code: Int!
    message: String!
    insentif: Int!
    special: Int!
    biaya: Int!
  }

  type ResponUserAdmin {
    code: Int!
    status: String!
    data: [UserAdmin]
  }

  type UserAdmin {
    email: String!
    username: String!
    tgl: String!
    verified: Boolean!
    isBanned: Boolean!
    idUser: String!
  }

  #Tambahan bagian form dan survei

  type ResponPublishData {
    code: Int!
    status: String!
    judul: String!
    tipe: String!
    jumlahSoal: Int!
  }

  type Order {
    emailUser: String!
    idOrder: String!
    hargaTotal: Int!
    tanggal: Int!
    presentasi: Int!
  }
  type responOrder {
    code: Int!
    status: String!
    data: [Order]
  }
  type ResponFormLaporan {
    status: String!
    code: Int!
    idForm: String!
    judul: String!
    deskripsi: String!
  }
  type keluhan {
    judulSurvei: String!
    email_pelapor: String!
    tanggal: Int!
    laporan: String!
    idSurvei: String!
  }
  type responKeluhan {
    code: Int!
    status: String!
    data: [keluhan]
  }
  type pencairan {
    jumlahPoin: Int!
    emailUser: String!
    waktu_pengajuan: Int!
    idPencairan: String!
    aktif: String!
    idUser: String!
  }
  type responPencairan {
    code: Int!
    status: String!
    data: [pencairan]
  }
`;

module.exports = { administrasiType };
