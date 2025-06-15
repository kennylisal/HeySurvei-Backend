const firebase = require("../../../db");
const firestore = firebase.firestore();
const { Timestamp, FieldPath } = require("firebase-admin/firestore");
const { v4: uuidv4 } = require("uuid");
const surveiResolvers = {
  Query: {
    async getHSurveiTerbaru(_, args) {
      try {
        const surveiRef = await firestore
          .collection("h_survei")
          .orderBy("tanggal_penerbitan", "desc")
          .limit(5)
          .get();
        let snapshot = surveiRef.docs.map((doc) => {
          return { id_survei: doc.id, ...doc.data() };
        });
        snapshot.forEach(function (item) {
          item.tanggal_penerbitan = item.tanggal_penerbitan._seconds;
        });
        console.log(snapshot);
        return {
          code: 200,
          status: "Success",
          data: snapshot,
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
    async getAllSurveiReport(_, args) {
      try {
        const surveiRef = await firestore.collection("h_survei").get();
        let snapshot = surveiRef.docs.map((doc) => {
          return { id_survei: doc.id, ...doc.data() };
        });
        snapshot.forEach(function (item) {
          item.tanggal_penerbitan = item.tanggal_penerbitan._seconds;
        });
        console.log(snapshot);
        return {
          code: 200,
          status: "Success",
          data: snapshot,
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
    async getFormkuV2(_, args) {
      try {
        let surveiKlasikRef = await firestore
          .collection("form-klasik")
          .where("id_user", "==", args.idUser)
          .where("isPublished", "==", false)
          .get();
        let listDataKlasik = surveiKlasikRef.docs.map((doc) => {
          return {
            id: doc.id,
            judul: doc.data().judul,
            tanggal: doc.data().tglUpdate._seconds,
            tipe: "klasik",
          };
        });

        let surveiKartuRef = await firestore
          .collection("form-kartu")
          .where("id_user", "==", args.idUser)
          .where("isPublished", "==", false)
          .get();
        let listDataKartu = surveiKartuRef.docs.map((doc) => {
          return {
            id: doc.id,
            judul: doc.data().judul,
            tanggal: doc.data().tglUpdate._seconds,
            tipe: "kartu",
          };
        });

        let listData = listDataKlasik.concat(listDataKartu);
        listData = listData.sort(
          (objB, objA) => Number(objA.tanggal) - Number(objB.tanggal)
        );

        return {
          code: 200,
          status: "Success",
          data: listData,
        };
      } catch (error) {
        return {
          code: 500,
          status: "Server Error : " + error,
          data: [],
        };
      }
    },
    async getSurveikuUtama(_, args) {
      try {
        //ambil survei dari h_survei
        const surveiRef = await firestore
          .collection("h_survei")
          .where("idUser", "==", args.idUser)
          .get();
        let snapshot = surveiRef.docs.map((doc) => {
          return { id_survei: doc.id, ...doc.data() };
        });
        snapshot.forEach(function (item) {
          item.tanggal_penerbitan = item.tanggal_penerbitan._seconds;
        });
        //

        //belanjan survei
        const beliRef = await firestore
          .collection("beli_survei")
          .where("idUser", "==", args.idUser)
          .get();
        let dataArr = [];
        beliRef.forEach((e) => {
          dataArr.push(e.data().idSurvei);
        });
        let snapshot2;
        if (dataArr.length == 0) {
          snapshot2 = [];
        } else {
          const beliSRef = await firestore
            .collection("h_survei")
            .where(FieldPath.documentId(), "in", dataArr)
            .get();
          snapshot2 = beliSRef.docs.map((doc) => {
            return { id_survei: doc.id, ...doc.data() };
          });
          snapshot2.forEach(function (item) {
            item.tanggal_penerbitan = item.tanggal_penerbitan._seconds;
          });
        }

        //ambil survei lagi dari sini
        console.log(dataArr);
        //
        return {
          code: 200,
          status: "Data berhasil diambil",
          survei: snapshot,
          beli: snapshot2,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "Terjadi kesalahan server",
          survei: [],
          beli: [],
        };
      }
    },
    async getSurveiDetail(_, args) {
      try {
        let hSurveiRef = await firestore
          .collection("h_survei")
          .doc(args.idSurvei)
          .get();
        let idDSurvei = hSurveiRef.data().id_d_survei;

        let dataHSurvei = {
          id_survei: hSurveiRef.id,
          ...hSurveiRef.data(),
        };
        dataHSurvei.tanggal_penerbitan =
          dataHSurvei.tanggal_penerbitan._seconds;

        // let dSurveiRef = await firestore.collection('d_survei').doc(args.idSurvei).get()
        // console.log(dSurveiRef.data())

        // let dataDSurvei = {
        //   id:dSurveiRef.id,
        //   ...dSurveiRef.data()
        // }
        //  console.log(dataDSurvei)
        return {
          code: 200,
          status: "sukses mengambil data",
          hSurvei: dataHSurvei,
          // dSurvei:dataDSurvei,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "Terjadi error server",
          hSurvei: null,
          // dSurvei:null,
        };
      }
    },
  },
  Mutation: {
    async buatFormKlasik(_, args) {
      try {
        const surveiRef = await firestore
          .collection("form-klasik")
          .doc(args.idForm)
          .set({
            judul: "Judul",
            petunjuk: "",

            tglUpdate: Timestamp.now(),
            isPublished: false,
            id_user: args.idUser,
            daftarSoal: [
              {
                idSoal: "pembatas - " + uuidv4().substring(0, 7),
                bagian: "",
                isPembatas: true,
                petunjuk: [{ insert: "Petunjuk Bagian\n" }],
              },
              {
                idSoal: uuidv4().substring(0, 7),
                isWajib: 0,
                lainnya: 0,
                listJawaban: [
                  {
                    idJawaban: "jawaban-" + uuidv4().substring(0, 7),
                    jawaban: "",
                  },
                ],
                pertanyaanSoal: [{ insert: "Soal Pertanyaan\n" }],
                isBergambar: 0,
                tipeSoal: "Pilihan Ganda",
              },
            ],
            daftarSoalCabang: [],
          });
        console.log("ini id baru klaik -> " + args.idForm);
        return {
          status: "success",
          data: "Survei berhasil ditambahkan",
          code: 200,
        };
      } catch (error) {
        console.log(error);
        return {
          status: "fail",
          data: "Terjadi kesalah Server: " + error,
          code: 500,
        };
      }
    },
    async buatFormKartu(_, args) {
      try {
        const surveiRef = await firestore
          .collection("form-kartu")
          .doc(args.idForm)
          .set({
            judul: "",
            petunjuk: "",

            tglUpdate: Timestamp.now(),
            isPublished: false,
            id_user: args.idUser,
            daftarSoal: [
              {
                idSoal: uuidv4().substring(0, 7),
                isWajib: 0,
                lainnya: 0,
                listJawaban: [
                  {
                    idJawaban: "jawaban-" + uuidv4().substring(0, 7),
                    jawaban: "",
                  },
                ],
                pertanyaanSoal: [{ insert: "Soal Pertanyaan\n" }],
                tipeSoal: "Pilihan Ganda",
                urlGambar: "",
                modelPertanyaan: "Model X",
              },
            ],
            daftarSoalCabang: [],
          });
        console.log("ini id baru klaik -> " + args.idForm);
        return {
          status: "success",
          data: "Survei berhasil ditambahkan",
          code: 200,
        };
      } catch (error) {
        return {
          status: "fail",
          data: "Terjadi kesalah Server: " + error,
          code: 500,
        };
      }
    },
    //pembuatan form
    async publishSurveiBaru(_, args) {
      try {
        //generate idSurvei mu disini nnt pakai UUid
        let idBaruH = "HSV - " + uuidv4().substring(0, 7);
        console.log("ini id baru survei yg perlu dihapus -> " + idBaruH);

        let batch = firestore.batch();

        batch.create(firestore.collection("h_survei").doc(idBaruH), {
          judul: args.survei.judul,
          harga: args.survei.harga,
          tanggal_penerbitan: Timestamp.now(),
          deskripsi: args.survei.deskripsi,
          durasi: args.survei.durasi,
          jumlahPartisipan: 0,
          batasPartisipan: args.survei.batasPartisipan,
          isKlasik: args.survei.isKlasik,
          status: args.survei.status,
          kategori: args.survei.kategori,
          idUser: args.idUser,
          pakaiDemografi: args.survei.pakaiDemografi,
          diJual: args.dSurvei.diJual,
          hargaJual: args.dSurvei.hargaJual,
          emailUser: args.survei.emailUser,
          hargaPerPartisipan: args.dSurvei.hargaPerPartisipan,
          insentifPerPartisipan: args.dSurvei.insentifPerPartisipan,
          demografiUsia: args.dSurvei.demografiUsia,
          demografiLokasi: args.dSurvei.demografiLokasi,
          demografiInterest: args.dSurvei.demografiInterest,
          batasPartisipan: args.dSurvei.batasPartisipan,
          idForm: args.idForm,
          diJual: args.dSurvei.diJual,
          hargaJual: args.dSurvei.hargaJual,
        });
        if (args.survei.isKlasik) {
          batch.update(firestore.collection("form-klasik").doc(args.idForm), {
            isPublished: true,
          });
        } else {
          batch.update(firestore.collection("form-kartu").doc(args.idForm), {
            isPublished: true,
          });
        }
        let judulSurvei = args.survei.judul;
        const response = await fetch(
          "https://server-sql-dot-hei-survei-v1.et.r.appspot.com/api/push",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idSurvei: idBaruH,
              namaSurvei: judulSurvei,
            }),
          }
        );
        const data = await response.json();

        const obj = JSON.parse(JSON.stringify(data));
        if (obj["msg"] === "berhasil") {
          console.log("ya berhasil");
          await batch.commit();
          return {
            status: "success",
            data: "Survei berhasil ditambahkan",
            code: 200,
          };
        } else {
          console.log("gagal");
          return {
            status: "failed",
            data: "gagal ditambahkan",
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
  },
};

module.exports = { surveiResolvers };
