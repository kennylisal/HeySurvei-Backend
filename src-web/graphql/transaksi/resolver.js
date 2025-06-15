const firebase = require("../../../db");
const firestore = firebase.firestore();

const transaksiResolver = {
  Query: {
    async getSejarahPencairan(_, args) {
      try {
        let sejarahRef = await firestore
          .collection("pencairan-surveyor")
          .where("idUser", "==", args.idUser)
          .get();
        if (sejarahRef.empty) {
          return {
            code: 200,
            status: "success",
            data: [],
          };
        } else {
          let snapshot = sejarahRef.docs.map((doc) => {
            return { idPengajuan: doc.id, ...doc.data() };
          });
          for (let e in snapshot) {
            snapshot[e].waktu_pengajuan = snapshot[e].waktu_pengajuan._seconds;
          }
          return {
            code: 200,
            status: "success",
            data: snapshot,
          };
        }
      } catch (error) {
        console.log(error);
        return {
          code: 200,
          status: "success",
          data: [],
        };
      }
    },
    async getSejarahPembelian(_, args) {
      try {
        let sejarahRef = await firestore
          .collection("sejarah-pembelian")
          .where("idUser", "==", args.idUser)
          .get();
        if (sejarahRef.empty) {
          return {
            code: 200,
            status: "success",
            data: [],
          };
        } else {
          let snapshot = sejarahRef.docs.map((doc) => {
            return { idSejarah: doc.id, ...doc.data() };
          });
          for (let e in snapshot) {
            snapshot[e].tglPembelian = snapshot[e].tglPembelian._seconds;
          }
          return {
            code: 200,
            status: "success",
            data: snapshot,
          };
        }
      } catch (error) {
        console.log(error);
        return {
          code: 200,
          status: "success",
          data: [],
        };
      }
    },
    async getSejarahUser(_, args) {
      try {
        //ambil htrans berdasarkan id
        //ambil semua idnya
        //pakai itu id untuk ambil d_trans
        let transRef = await firestore
          .collection("h_trans")
          .where("idUser", "==", args.idUser)
          .get();
        let transData = transRef.docs.map((doc) => {
          return { idTrans: doc.id, ...doc.data() };
        });

        for (let e in transData) {
          transData[e].tanggalTransaksi =
            transData[e].tanggalTransaksi._seconds;
        }

        let arrIdTrans = [];
        transData.forEach((e) => {
          arrIdTrans.push(e.idTrans);
        });

        if (arrIdTrans.length != 0) {
          let detailRef = await firestore
            .collection("d_trans")
            .where(FieldPath.documentId(), "in", arrIdTrans)
            .get();
          let detailData = detailRef.docs.map((doc) => {
            return { ...doc.data() };
          });

          // console.log(detailData[0].listSurvei)

          for (var e in transData) {
            transData[e].detail = detailData[e];
          }
          console.log(transData[0].detail);
          return {
            code: 200,
            status: "Data berhasil diambil",
            data: transData,
          };
        } else {
          return {
            code: 200,
            status: "Data berhasil diambil",
            data: [],
          };
        }
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: null,
        };
      }
    },
    async getOrderDetail(_, args) {
      try {
        let orderRef = await firestore
          .collection("order")
          .where("idUser", "==", args.idUser)
          .where("deleted", "==", false)
          .get();
        let snapshot = orderRef.docs.map((doc) => {
          return { idOrder: doc.id, ...doc.data() };
        });

        let surveiRef = await firestore
          .collection("h_survei")
          .where(FieldPath.documentId(), "in", snapshot[0].listSurvei)
          .get();
        let dataSurvei = surveiRef.docs.map((doc) => {
          return { id_survei: doc.id, ...doc.data() };
        });

        for (let e in dataSurvei) {
          dataSurvei[e].tanggal_penerbitan =
            dataSurvei[e].tanggal_penerbitan._seconds;
          if (dataSurvei[e].gambarSurvei == null) {
            dataSurvei[e].gambarSurvei = "";
          }
        }
        console.log(dataSurvei);
        return {
          code: 200,
          status: "Data berhasil diambil",
          data: dataSurvei,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: [],
        };
      }
    },

    async getOrderUser(_, args) {
      try {
        let orderRef = await firestore
          .collection("order")
          .where("idUser", "==", args.idUser)
          .where("status", "==", "aktif")
          .get();
        if (orderRef.empty) {
          return {
            code: 400,
            status: "Data kosong",
            data: null,
          };
        } else {
          let snapshot = orderRef.docs.map((doc) => {
            return { idOrder: doc.id, ...doc.data() };
          });
          snapshot[0].tanggal = snapshot[0].tanggal._seconds;
          let order = snapshot[0];
          console.log(order);
          let surveiOrder = [];
          for (var e in order.listSurvei) {
            surveiOrder.push(order.listSurvei[e].idSurvei);
          }
          if (order.length != 0) {
            let surveiRef = await firestore
              .collection("h_survei")
              .where(FieldPath.documentId(), "in", surveiOrder)
              .get();
            let snapshotSurvei = surveiRef.docs.map((doc) => {
              return { id_survei: doc.id, ...doc.data() };
            });
            for (let e in snapshotSurvei) {
              snapshotSurvei[e].tanggal_penerbitan =
                snapshotSurvei[e].tanggal_penerbitan._seconds;
            }
            order.listSurvei = snapshotSurvei;
            console.log(order);
            return {
              code: 200,
              status: "Data berhasil diambil",
              data: order,
            };
          } else {
            return {
              code: 200,
              status: "Data berhasil diambil",
              data: [],
            };
          }
        }
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: null,
        };
      }
    },
    async getCartKu(_, args) {
      try {
        let cartRef = await firestore
          .collection("cart")
          .where("idUser", "==", args.idUser)
          .where("status", "==", "aktif")
          .get();
        if (cartRef.empty) {
          return {
            code: 200,
            status: "Tidak ada data",
            data: [],
            listCart: [],
          };
        } else {
          let arrIdSurvei = [];
          let arrIdCart = [];
          cartRef.docs.map((doc) => {
            arrIdSurvei.push(doc.data().idSurvei);
          });
          // console.log(arrIdSurvei);
          let hSurveiRef = await firestore
            .collection("h_survei")
            .where(FieldPath.documentId(), "in", arrIdSurvei)
            .get();
          let snapshot = hSurveiRef.docs.map((doc) => {
            return { id_survei: doc.id, ...doc.data() };
          });
          for (let e in snapshot) {
            snapshot[e].tanggal_penerbitan =
              snapshot[e].tanggal_penerbitan._seconds;
          }
          cartRef.docs.map((doc) => {
            arrIdCart.push(doc.id);
          });
          return {
            code: 200,
            status: "success",
            data: snapshot,
            listCart: arrIdCart,
          };
        }
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: [],
          listCart: [],
        };
      }
    },
    async getSejarahOrder(_, args) {
      try {
        let orderRef = await firestore
          .collection("order")
          .where("idUser", "==", args.idUser)
          .where("status", "==", "sukses")
          .get();
        if (orderRef.empty) {
          return {
            code: 200,
            status: "Data kosong",
            data: [],
          };
        } else {
          let snapshot = orderRef.docs.map((doc) => {
            return { idOrder: doc.id, ...doc.data() };
          });
          for (var e in snapshot) {
            snapshot[e].tanggal = snapshot[e].tanggal._seconds;
          }
          return {
            code: 200,
            status: "Data berhasil diambil",
            data: snapshot,
          };
        }
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: [],
        };
      }
    },
    async getSPP(_, args) {
      try {
        let sejarahRef = await firestore
          .collection("riwayat-penambahan-poin")
          .where("idUser", "==", args.idUser)
          .get();
        if (!sejarahRef.empty) {
          let snapshot = sejarahRef.docs.map((doc) => {
            return { ...doc.data() };
          });
          for (var e in snapshot) {
            let surveiRef = await firestore
              .collection("h_survei")
              .doc(snapshot[e].idSurvei)
              .get();
            snapshot[e].survei = {
              id_survei: surveiRef.id,
              ...surveiRef.data(),
            };
            snapshot[e].survei.tanggal_penerbitan =
              snapshot[e].survei.tanggal_penerbitan._seconds;
            if (snapshot[e].survei.gambarSurvei == null) {
              snapshot[e].survei.gambarSurvei = "";
            }
            snapshot[e].tglPenambahan = snapshot[e].tglPenambahan._seconds;
          }
          console.log(snapshot);
          return {
            code: 200,
            status: "Success",
            data: snapshot,
          };
        } else {
          return {
            code: 200,
            status: "Success",
            data: [],
          };
        }
      } catch (error) {
        return {
          code: 500,
          status: "failed",
          data: [],
        };
      }
    },

    async getOrderPilihan(_, args) {
      try {
        let orderRef = await firestore
          .collection("order")
          .doc(args.idOrder)
          .get();
        let snapshot = { idOrder: orderRef.id, ...orderRef.data() };
        snapshot.tanggal = snapshot.tanggal._seconds;
        let surveiRef = await firestore
          .collection("riwayat-detail-survei")
          .where(FieldPath.documentId(), "in", snapshot.listDetailSurvei)
          .get();
        let snapshotSurvei = surveiRef.docs.map((doc) => {
          return { id_survei: doc.id, ...doc.data() };
        });
        snapshot.listSurvei = snapshotSurvei;
        return {
          code: 200,
          status: "Success",
          data: snapshot,
        };
      } catch (error) {
        return {
          code: 500,
          status: "failed",
          data: null,
        };
      }
    },
  },
  Mutation: {
    async buatOrder(_, args) {
      try {
        //cek dulu lagi ada order aktif tidak
        let date = new Date().toLocaleDateString();
        let kodeOrder = uuidv4().substring(0, 7);
        let idOrder = "OD - " + kodeOrder;
        let invoiceId =
          "INV/" + date.replace("/", "").replace("/", "") + "/" + kodeOrder;
        const orderCek = await firestore
          .collection("order")
          .where("idUser", "==", args.idUser)
          .where("status", "==", "aktif")
          .get();
        if (orderCek.empty) {
          let batch = firestore.batch();
          //bagian matikan cart
          args.order.listCarts.forEach((e) => {
            batch.update(
              firestore.collection("cart").doc(e),
              "status",
              "diproses"
            );
          });

          //bagian copas h_survei
          let arrRDS = [];
          let arrSurvei = [];
          let surveiRef = await firestore
            .collection("h_survei")
            .where(FieldPath.documentId(), "in", args.order.listSurvei)
            .get();
          let snapshot = surveiRef.docs.map((doc) => {
            return { id_survei: doc.id, ...doc.data() };
          });

          for (let e in snapshot) {
            snapshot[e].tanggal_penerbitan =
              snapshot[e].tanggal_penerbitan._seconds;
            let idBaru = "RDS - " + uuidv4().substring(0, 7);
            arrRDS.push(idBaru);
            // arrSurvei.push(snapshot[e].id_survei)
            arrSurvei.push({
              idSurvei: snapshot[e].id_survei,
              idPemilik: snapshot[e].idUser,
              harga: snapshot[e].hargaJual,
            });
            batch.create(
              firestore.collection("riwayat-detail-survei").doc(idBaru),
              snapshot[e]
            );
          }

          batch.create(firestore.collection("order").doc(idOrder), {
            status: "aktif",
            hargaTotal: args.order.harga,
            presentasi: 70,
            tanggal: Timestamp.now(),
            idUser: args.idUser,
            emailUser: args.order.email,
            listDetailSurvei: arrRDS,
            listSurvei: arrSurvei,
            listCarts: args.order.listCarts,
            invoice: invoiceId,
          });

          //bagian bikin midtrans
          let idMidtrans = "test-transaction-" + uuidv4().substring(0, 7);
          var sukses = false;
          var bank = "";
          var nomorVA = "";
          var order_id = "";
          let core = new midtransClient.CoreApi({
            isProduction: false,
            serverKey: process.env.serverKey,
            clientKey: process.env.clientKey,
          });

          let parameter = {
            payment_type: "bank_transfer",
            transaction_details: {
              gross_amount: args.order.harga,
              order_id: idMidtrans,
            },
            bank_transfer: {
              bank: "bni",
            },
          };

          await core
            .charge(parameter)
            .then((chargeResponse) => {
              // console.log('chargeResponse:',JSON.stringify(chargeResponse));
              sukses = true;
              const obj = JSON.parse(JSON.stringify(chargeResponse));
              bank = obj["va_numbers"][0]["bank"];
              nomorVA = obj["va_numbers"][0]["va_number"];
              order_id = obj["order_id"];
            })
            .catch((e) => {
              console.log("Error occured:", e.message);
            });
          console.log(order_id);
          await dbRT.ref(`/authTagihan/${order_id}`).set({
            idUser: args.idUser,
            idOrder: idOrder,
            tipe: "pembelian survei",
          });
          await dbRT.ref(`/tagihanPembelian/${args.idUser}`).set({
            invoice: invoiceId,
            totalPembayaran: args.order.harga,
            namaBank: bank,
            nomorVA: nomorVA,
            idMidtrans: order_id,
            idOrder: idOrder,
          });

          await batch.commit();

          return {
            code: 200,
            status: "success",
            data: "Order berhasil terbuat",
          };
        } else {
          return {
            code: 400,
            status: "success",
            data: "Order sebelumnya lagi aktif, selesaikan terlebih dahulu",
          };
        }
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: "Terjadi kesalahan server",
        };
      }
    },
    async buatCart(_, args) {
      try {
        // cek dulu datanya sudah ada belum
        const cekRef = await firestore
          .collection("cart")
          .where("idSurvei", "==", args.idSurvei)
          .where("idUser", "==", args.idUser)
          .get();
        if (cekRef.empty) {
          const cartRef = await firestore.collection("cart").add({
            idUser: args.idUser,
            idSurvei: args.idSurvei,
            status: "aktif",
          });
          return {
            status: "success",
            data: "Survei berhasil dimasukkan ke keranjang",
            code: 200,
          };
        } else {
          return {
            status: "fail",
            data: "Survei sudah ada di keranjang",
            code: 400,
          };
        }
      } catch (error) {
        return {
          status: "fail",
          data: "Terjadi kesalah Server: " + error,
          code: 500,
        };
      }
    },
    async batalkanOrder(_, args) {
      try {
        let orderRef = await firestore
          .collection("order")
          .doc(args.idOrder)
          .update({
            delete: true,
          });

        return {
          code: 200,
          status: "success",
          data: "order berhasil dibatalkan",
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: "Terjadi kesalahan server",
        };
      }
    },
    async ajukanPencairan(_, args) {
      try {
        let pengecekanRef = await firestore
          .collection("pencairan-surveyor")
          .where("aktif", "==", "Diproses")
          .where("idUser", "==", args.idUser)
          .get();
        if (pengecekanRef.empty) {
          let buatRef = await firestore.collection("pencairan-surveyor").add({
            jumlahPoin: args.jumlah,
            waktu_pengajuan: Timestamp.now(),
            idUser: args.idUser,
            emailUser: args.email,
            aktif: "Diproses",
          });
          return {
            code: 200,
            status: "success",
            data: "Permintaan terkirim",
          };
        } else {
          return {
            code: 400,
            status: "failed",
            data: "Sudah ada pencairan sebelumnya",
          };
        }
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          pesan: "Terjadi kegagalan server",
        };
      }
    },
    async hapusCart(_, args) {
      try {
        let formRef = await firestore
          .collection("cart")
          .doc(args.idCart)
          .delete();
        return {
          code: 200,
          status: "success",
          data: "Penghapusan sukses",
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: "Terjadi Kesalahan Server",
        };
      }
    },
    async cobaMid(_, args) {
      var json = `{"status_code":"201","status_message":"Success, Ba
                nk Transfer transaction is created","transaction_id":"edeee18c-cd
                ce-473c-b0f8-807628fba815","order_id":"test-transaction-h5cyuw1","
                merchant_id":"G453636788","gross_amount":"200000.00","currency":"IDR","payment_
                type":"bank_transfer","transaction_time":"2024-04-22 20:56:50","transaction_status
                ":"pending","fraud_status":"accept","va_numbers":[{"bank":"bni","va_number":"9883678816954472"}],
                "expiry_time":"2024-04-23 20:56:50"}`;

      try {
        var sukses = false;
        var bank = "";
        var nomorVA = "";
        var idOrder = "";
        let core = new midtransClient.CoreApi({
          isProduction: false,
          serverKey: process.env.serverKey,
        });

        let parameter = {
          payment_type: "bank_transfer",
          transaction_details: {
            gross_amount: args.jumlahPembayaran,
            order_id: "test-transaction-" + args.idTrans,
          },
          bank_transfer: {
            bank: "bni",
          },
        };
        await core
          .charge(parameter)
          .then((chargeResponse) => {
            console.log("chargeResponse:", JSON.stringify(chargeResponse));
            sukses = true;
            const obj = JSON.parse(JSON.stringify(chargeResponse));
            bank = obj["va_numbers"][0]["bank"];
            nomorVA = obj["va_numbers"][0]["va_number"];
            idOrder = obj["order_id"];
          })
          .catch((e) => {
            console.log("Error occured:", e.message);
          });
        if (sukses) {
          console.log("Mengirim kembali data ke aplikasi sukses");
          return {
            code: 200,
            status: "data berhasil diambil",
            bank: bank,
            nomorVA: nomorVA,
            idOrder: idOrder,
          };
        } else {
          console.log("Mengirim kembali data ke aplikasi gagal");
          return {
            code: 400,
            status: "data gagal diambil",
            bank: "",
            nomorVA: "",
            idOrder: "",
          };
        }
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "data gagal diambil",
          bank: "",
          nomorVA: "",
          idOrder: "",
        };
      }
    },

    async prosesOrder(_, args) {
      try {
        //ini data order
        let orderRef = await firestore
          .collection("order")
          .doc(args.idOrder)
          .get();
        let orderanData = { idOrder: orderRef.id, ...orderRef.data() };
        //
        console.log(orderanData);
        //ambil data survei dari orderan
        let surveiRef = await firestore
          .collection("h_survei")
          .where(FieldPath.documentId(), "in", orderanData.listSurvei)
          .get();
        let dataSurvei = surveiRef.docs.map((doc) => {
          return {
            id_survei: doc.id,
            judulSurvei: doc.data().judul,
            deskripsi: doc.data().deskripsi,
            harga: doc.data().harga,
            isKlasik: doc.data().isKlasik,
            // ...doc.data(),
          };
        });

        console.log(dataSurvei);

        //pembuatan batch
        let batch = firestore.batch();
        //
        batch.update(firestore.collection("order").doc(args.idOrder), {
          deleted: true,
        });

        // let idTrans =  "TR - "+ uuidv4().substring(0,7)
        let idUnik = uuidv4().substring(0, 7);
        let idTrans = "TR - " + idUnik;
        let invBaru = "INV/" + generateTanggalInv() + "/" + idUnik;
        batch.create(firestore.collection("h_trans").doc(idTrans), {
          idUser: orderanData.idUser,
          tanggalTransaksi: Timestamp.now(),
          totalHarga: orderanData.harga,
          invoice: invBaru,
        });

        batch.create(firestore.collection("d_trans").doc(idTrans), {
          idOrder: args.idOrder,
          caraPembayaran: "BCA - masih nunggu dari midtrans",
          listSurvei: dataSurvei,
        });

        orderanData.listSurvei.forEach((e) => {
          batch.create(
            firestore.collection("beli_survei").doc(uuidv4().substring(0, 10)),
            {
              idUser: orderanData.idUser,
              idSurvei: e,
            }
          );
        });
        await batch.commit();
        return {
          code: 200,
          status: "success",
          data: "order berhasil diproses",
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: "Terjadi kesalahan server",
        };
      }
    },
  },
};

module.exports = { transaksiResolver };
