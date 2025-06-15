const firebase = require("../../../db");
const firestore = firebase.firestore();
const surveiResolver = {
  Query: {
    async rekomendasiPakaiPengecekan(_, args) {
      try {
        return {
          code: 200,
          status: "Success",
          pesan: "true",
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          pesan: "terjadi kesalahan server",
        };
      }
    },
    async demografiBisaUpdate(_, args) {
      try {
        return {
          code: 200,
          status: "Success",
          pesan: "true",
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          pesan: "terjadi kesalahan server",
        };
      }
    },

    async getSurveiTerlarang(_, args) {
      try {
        let jawabanRef = await firestore
          .collection("jawaban-survei-v3")
          .where("idUser", "==", args.idUser)
          .get();
        // let snapshot = jawabanRef.docs.map(doc => {return {idJawaban: doc.id, ...doc.data()}})
        var arrTemp = [];
        jawabanRef.docs.forEach((element) => {
          arrTemp.push(element.data().idSurvei);
        });
        return {
          code: 200,
          status: "success",
          data: arrTemp,
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
    async getAllDemoSurvei(_, args) {
      try {
        let tigaSurveiRef = await firestore
          .collection("h_survei")
          .where("pakaiDemografi", "==", true)
          .get();
        let snapshot = tigaSurveiRef.docs.map((doc) => {
          return { id_survei: doc.id, ...doc.data() };
        });
        for (let e in snapshot) {
          snapshot[e].tanggal_penerbitan =
            snapshot[e].tanggal_penerbitan._seconds;
          snapshot[e].insentif = snapshot[e].insentifPerPartisipan;
          if (snapshot[e].gambarSurvei == null) {
            snapshot[e].gambarSurvei = "";
          }
        }
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
    async getDefaultSurvei(_, args) {
      try {
        let tigaSurveiRef = await firestore
          .collection("h_survei")
          .orderBy("tanggal_penerbitan", "desc")
          .where("pakaiDemografi", "==", false)
          .limit(10)
          .get();
        let arrSurvei = [];
        let snapshot = tigaSurveiRef.docs.map((doc) => {
          return { id_survei: doc.id, ...doc.data() };
        });
        for (let e in snapshot) {
          snapshot[e].tanggal_penerbitan =
            snapshot[e].tanggal_penerbitan._seconds;
          snapshot[e].insentif = snapshot[e].insentifPerPartisipan;
          if (snapshot[e].gambarSurvei == null) {
            snapshot[e].gambarSurvei = "";
          }
        }

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
    async getIdForm(_, args) {
      try {
        let surveiRef = await firestore
          .collection("d_survei")
          .doc(args.idSurvei)
          .get();
        let idForm = surveiRef.data().idForm;
        return {
          code: 200,
          status: "Success",
          pesan: idForm,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: "",
        };
      }
    },
    async cekIsiSurvei(_, args) {
      try {
        let surveiRef = await firestore
          .collection("h_survei")
          .doc(args.idSurvei)
          .get();
        let batas = surveiRef.data().batasPartisipan;
        let jumlah = surveiRef.data().jumlahPartisipan;
        if (batas > jumlah) {
          return {
            code: 200,
            status: "Success",
            pesan: surveiRef.data().idForm,
          };
        } else {
          return {
            code: 400,
            status: "Memenuhi Batas",
            pesan: "",
          };
        }
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: "",
        };
      }
    },
    async getSurveiTerbaru(_, args) {
      try {
        let arrPilihan = [
          "HSV - 0136a7d",
          "HSV - 145499c",
          "HSV - 16ba051",
          "HSV - 6adc863",
          "HSV - e3bee11",
        ];
        let tigaSurveiRef = await firestore
          .collection("h_survei")
          .orderBy(FieldPath.documentId())
          .where(FieldPath.documentId(), "in", arrPilihan)
          .get();
        let snapshot = tigaSurveiRef.docs.map((doc) => {
          return { id_survei: doc.id, ...doc.data() };
        });
        for (let e in snapshot) {
          snapshot[e].tanggal_penerbitan =
            snapshot[e].tanggal_penerbitan._seconds;
          snapshot[e].insentif = snapshot[e].insentifPerPartisipan;
          if (snapshot[e].gambarSurvei == null) {
            snapshot[e].gambarSurvei = "";
          }
        }

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
    async getAllSurvei(_, args) {
      try {
        const surveiRef = await firestore.collection("survei-v2").get();
        let snapshot = surveiRef.docs.map((doc) => {
          return { id_survei: doc.id, ...doc.data() };
        });
        for (let e in snapshot) {
          console.log(snapshot[e].tanggal);
          snapshot[e].tanggal = snapshot[e].tanggal._seconds;
        }
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
    async searchSurveiNormal(_, args) {
      try {
        //dari sini
        let idTarget = [];
        const response = await fetch(
          "https://server-sql-dot-hei-survei-v1.et.r.appspot.com/api/search",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cari: args.search,
            }),
          }
        );
        const data = await response.json();
        const obj = JSON.parse(JSON.stringify(data));
        for (let index = 0; index < obj["hasil"].length; index++) {
          idTarget.push(obj["hasil"][index]);
        }
        console.log(idTarget.length);
        if (idTarget.length > 30) {
          idTarget = idTarget.slice(0, 30);
        }

        var surveiResult;
        if (idTarget.length > 0) {
          let surveiRef = firestore
            .collection("h_survei")
            .orderBy(FieldPath.documentId())
            .where(FieldPath.documentId(), "in", idTarget)
            .where("pakaiDemografi", "==", false);
          surveiResult = await surveiRef.get();
        } else {
          return {
            code: 200,
            status: "success",
            data: [],
          };
        }

        let snapshot = surveiResult.docs.map((doc) => {
          return { id_survei: doc.id, ...doc.data() };
        });
        for (let e in snapshot) {
          snapshot[e].tanggal_penerbitan =
            snapshot[e].tanggal_penerbitan._seconds;
          snapshot[e].insentif = snapshot[e].insentifPerPartisipan;
          if (snapshot[e].gambarSurvei == null) {
            snapshot[e].gambarSurvei = "";
          }
        }
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
    async getSurveiDetail(_, args) {
      try {
        let hSurveiRef = await firestore
          .collection("h_survei")
          .doc(args.idSurvei)
          .get();
        // let dSurveiRef = await firestore.collection("d_survei").doc(args.idSurvei).get()
        let survei = { id_survei: hSurveiRef.id, ...hSurveiRef.data() };
        // let dSurvei = {id_survei : dSurveiRef.id, ...dSurveiRef.data()}

        survei.tanggal_penerbitan = survei.tanggal_penerbitan._seconds;
        survei.insentif = survei.insentifPerPartisipan;
        console.log(survei);

        let userRef = await firestore
          .collection("Users")
          .doc(survei.idUser)
          .get();
        return {
          code: 200,
          status: "success",
          survei: survei,
          user: { ...userRef.data() },
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "Server Error, akibat : " + error,
          survei: null,
          user: null,
        };
      }
    },
  },
  Mutation: {
    async kirimPenilaianSurvei(_, args) {
      try {
        let penilaianRef = await firestore.collection("penilaian-survei").add({
          idSurvei: args.idSurvei,
          idUser: args.idUser,
          emailUser: args.email,
          pesan: args.pesan,
          nilai: args.nilai,
          waktu_penilaian: Timestamp.now(),
        });
        console.log("sampai sini");
        return {
          code: 200,
          status: "success",
          pesan: "Penilaian Terkirim",
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          pesan: "Terjadi kegagalan server",
        };
      }
    },
    async kirimReport(_, args) {
      try {
        let buatRef = await firestore.collection("laporan_survei").add({
          laporan: args.laporan,
          email_pelapor: args.email,
          idUser: args.idUser,
          idSurvei: args.idSurvei,
          tanggal: Timestamp.now(),
          judulSurvei: args.judulSurvei,
        });
        return {
          code: 200,
          status: "success",
          pesan: "Laporan Terkirim",
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          pesan: "Terjadi kegagalan server",
        };
      }
    },

    async reportSurvei(_, args) {
      try {
        const reportRef = await firestore.collection("report-survei").add({
          idSurvei: args.idSurvei,
          idUser: args.idUser,
          pesan: args.pesan,
        });
        return {
          status: "success",
          data: "report berhasil dikirim",
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
  },
};

module.exports = { surveiResolver };
