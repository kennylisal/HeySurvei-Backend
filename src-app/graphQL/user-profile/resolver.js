const firebase = require("../../../db");
const firestore = firebase.firestore();

const userProfileResolver = {
  Query: {
    async getAllKota(_, args) {
      try {
        let kategoriRef = await firestore.collection("list_kota").get();

        var arrTemp = [];
        kategoriRef.docs.forEach((element) => {
          arrTemp.push(element.data().nama_kota);
        });
        return {
          code: 200,
          status: "Data berhasil diambil",
          data: arrTemp,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "Server Error, akibat : " + e,
          data: [],
        };
      }
    },
    async getAllInterest(_, args) {
      try {
        let kategoriRef = await firestore
          .collection("interest")
          .orderBy("nama")
          .get();

        var arrTemp = [];
        var hasil = kategoriRef.docs.forEach((element) => {
          arrTemp.push(element.data().nama);
        });

        return {
          code: 200,
          status: "Data berhasil diambil",
          data: arrTemp,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "Server Error, akibat : " + e,
          data: [],
        };
      }
    },
    async getAllHistory(_, args) {
      try {
        let jawabanRef = await firestore
          .collection("jawaban-survei-v3")
          .where("idUser", "==", args.idUser)
          .get();
        let snapshot = jawabanRef.docs.map((doc) => {
          return { idJawaban: doc.id, ...doc.data() };
        });

        let arrSurvei = [];
        for (let e in snapshot) {
          arrSurvei.push(snapshot[e].idSurvei);
        }
        if (arrSurvei.length == 0) {
          return {
            code: 200,
            status: "success",
            data: [],
          };
        } else {
          // .orderBy(FieldPath.documentId())
          let surveiRef = await firestore
            .collection("h_survei")
            .where(FieldPath.documentId(), "in", arrSurvei)
            .get();
          let snapshotSurvei = surveiRef.docs.map((doc) => {
            return { id_survei: doc.id, ...doc.data() };
          });
          for (let e in snapshotSurvei) {
            snapshotSurvei[e].insentif = snapshot[e].insentif;
            snapshotSurvei[e].tglPengisian = snapshot[e].tglPengisian._seconds;
            if (snapshot[e].gambarSurvei == null) {
              snapshot[e].gambarSurvei = "";
            }
          }
          console.log(snapshotSurvei);
          return {
            code: 200,
            status: "success",
            data: snapshotSurvei,
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
    async cekNoHp(_, args) {
      try {
        let ref = await firestore
          .collection("Users-survei")
          .where("noHP", "==", args.noHP)
          .get();
        if (ref.empty) {
          return {
            status: "success",
            pesan: "NoHP aman",
            code: 200,
          };
        } else {
          return {
            status: "failed",
            pesan: "NoHP telah terpakai",
            code: 400,
          };
        }
      } catch (error) {
        console.log(e);
        return {
          status: "failed",
          pesan: "Server masalah",
          code: 500,
        };
      }
    },
    async getSejarahPencairan(_, args) {
      try {
        let sejarahRef = await firestore
          .collection("pencairan")
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
  },
  Mutation: {
    async updatePassword(_, args) {
      try {
        let cekRef = await firestore
          .collection("Users-survei")
          .doc(args.idUser)
          .get();
        var isMatch = true;
        if (isMatch) {
          let passCrypted = await bcryptjs.hash(args.password, 8);
          console.log("ini paswword baru -> " + passCrypted);
          let userRef = await firestore
            .collection("Users-survei")
            .doc(args.idUser)
            .update({
              password: passCrypted,
            });

          return {
            code: 200,
            status: "success",
            pesan: "Password berhasil diUpadte",
          };
        } else {
          return {
            code: 400,
            status: "failed",
            pesan: "Password lama tidak sesuai ",
          };
        }
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          pesan: "Terjadi kesalahan Server",
        };
      }
    },
    async updateFoto(_, args) {
      try {
        //ganti semua data
        let userRef = await firestore
          .collection("Users-survei")
          .doc(args.idUser)
          .update({
            urlGambar: args.urlFoto,
          });
        return {
          code: 200,
          status: "success",
          pesan: "Gambar berhasil diUpdate",
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          pesan: "Terjadi kesalahan Server",
        };
      }
    },
    async updateDemo(_, args) {
      try {
        console.log("mencoba update demo");
        let userRef = await firestore
          .collection("Users-survei")
          .doc(args.idUser)
          .update({
            interest: args.interest,
            kota: args.kota,
            tglLahir: Timestamp.fromDate(new Date(args.tgl * 1000)),
          });
        return {
          code: 200,
          status: "success",
          pesan: "Demografi berhasil diUpdate",
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          pesan: "Terjadi kesalahan Server",
        };
      }
    },
    async percobaanX(_, args) {
      try {
        console.log("mencoba update demo");
        console.log(args.kota);
        console.log(args.tgl);
        // console.log(args.interest)
        console.log(args.idUser);
        return {
          code: 200,
          status: "success",
          pesan: "Demografi berhasil diUpdate",
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          pesan: "Terjadi kesalahan Server",
        };
      }
    },
    async ajukanPencairan(_, args) {
      try {
        let pengecekanRef = await firestore
          .collection("pencairan")
          .where("aktif", "==", "Diproses")
          .where("idUser", "==", args.idUser)
          .get();
        if (pengecekanRef.empty) {
          let buatRef = await firestore.collection("pencairan").add({
            jumlahPoin: args.jumlah,
            waktu_pengajuan: Timestamp.now(),
            idUser: args.idUser,
            emailUser: args.email,
            aktif: "Diproses",
          });
          return {
            code: 200,
            status: "success",
            pesan: "Permintaan terkirim",
          };
        } else {
          return {
            code: 400,
            status: "failed",
            pesan: "Sudah ada pencairan sebelumnya",
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
  },
};

module.exports = { userProfileResolver };
