const { gql } = require("apollo-server-express");

const transaksiMutation = gql`
  extend type Mutation {
    #TransaksiController
    buatOrder(order: orderInput!, idUser: String!): ResponStandar

    #transaksiController
    batalkanOrder(idOrder: String!): ResponStandar!
    prosesOrder(idOrder: String!): ResponStandar!
    #cart
    buatCart(idSurvei: String!, idUser: String!): ResponStandar!

    #dibawah transaksi Midtrasn dkk
    cobaMid(idTrans: String!, jumlahPembayaran: Int!): ResponMidTrans!
    bikinTrans(trans: inputTrans!): ResponStandar!
    hapusCart(idCart: String!): ResponStandar!
    ajukanPencairan(
      jumlah: Int!
      idUser: String!
      email: String!
    ): ResponStandar!
  }
`;

module.exports = { transaksiMutation };
