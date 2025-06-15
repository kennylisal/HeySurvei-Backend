const { gql } = require("apollo-server-express");

const transaksiTypes = gql`
  type orderData {
    tanggal: Int!
    idUser: String!
    listSurvei: [HSurvei]
    listDetailSurvei: [String!]
    listCarts: [String!]
    hargaTotal: Int!
    idOrder: String!
    invoice: String
  }

  input inputTrans {
    judul: String!
    totalPembayaran: Int!
    namaBank: String!
    nomorVA: String!
    idOrder: String
    idUser: String!
    idSurvei: String!
  }

  type sejarahPenambahanPoin {
    emailPembeli: String
    survei: HSurvei
    tambahPoin: Int
    idOrder: String
    tglPenambahan: Int
  }

  type responSPP {
    status: String!
    code: Int!
    data: [sejarahPenambahanPoin]
  }

  type pembelian {
    emailPembeli: String!
    idSejarah: String!
    idUser: String!
    namaSurvei: String!
    tglPembelian: Int!
    pendapatan: Int!
  }
  type responPembelian {
    code: Int
    status: String
    data: [pembelian]
  }

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

  type ResponMidTrans {
    code: Int!
    status: String!
    bank: String!
    nomorVA: String!
    idOrder: String!
  }
  type ResponInt {
    status: String!
    data: Int!
    code: Int!
  }
  type responOrderUser {
    code: Int!
    status: String!
    data: orderData
  }
  type responSejarahOrder {
    code: Int!
    status: String!
    data: [orderData]
  }

  type responCart {
    code: Int!
    status: String!
    data: [HSurvei]
    listCart: [String]
  }

  type DetailTransaksi {
    caraPembayaran: String!
    listSurvei: [surveiDetailTrans]
  }
  type surveiDetailTrans {
    deskripsi: String!
    harga: Int!
    id_survei: String!
    judulSurvei: String!
    isKlasik: Boolean!
  }
  type responTransaksi {
    code: Int!
    status: String!
    data: [transaksi]
  }
  type transaksi {
    idTrans: String!
    tanggal: Int!
    hargaTotal: Int!
    invoice: String!
    detail: DetailTransaksi
  }
  input orderInput {
    listSurvei: [String!]
    listCarts: [String!]
    harga: Int!
    email: String!
  }
`;

module.exports = { transaksiTypes };
