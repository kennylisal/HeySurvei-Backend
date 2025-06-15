const firebase = require("../../../db");
const firestore = firebase.firestore();

const authResolver = {
  Query: {
    async getUserData(_, args) {
      try {
        let userRef = await firestore
          .collection("Users")
          .doc(args.idUser)
          .get();
        console.log(args.idUser);
        let snapshot = {
          idUser: userRef.id,
          urlGambar: userRef.data().urlGambar,
          email: userRef.data().email,
          poin: userRef.data().poin,
          username: "",
        };
        return {
          code: 200,
          status: "Data berhasil diambil",
          data: snapshot,
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: null,
        };
      }
    },
    async masukUser(_, args) {
      try {
        const userRef = await firestore
          .collection("Users")
          .where("email", "==", args.email)
          .get();
        if (!userRef.empty) {
          let snapshot = userRef.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });
          let user = snapshot[0];
          if (user.password === "") {
            console.log("akun gugle ini");
            return {
              pesan: "Akun harus diakses lewat google sign-in",
              id: "",
              code: 400,
            };
          }
          const isMatch = await bcryptjs.compare(args.password, user.password);
          if (isMatch) {
            //if()
            //disini cek bagaiamna baca is banned dan isVerifikasi
            return {
              pesan: "success",
              id: user.id,
              code: 200,
            };
          } else {
            return {
              pesan: "Kredensial tidak ditemukan",
              id: "",
              code: 400,
            };
          }
        } else {
          return {
            pesan: "Kredensial Tidak ditemukan",
            id: "",
            code: 400,
          };
        }
      } catch (error) {
        return {
          pesan: "failed",
          data: "Server Error",
          code: 500,
        };
      }
    },
    async userData(_, args) {
      try {
        const userRef = await firestore
          .collection("Users")
          .doc(args.idUser)
          .get();
        console.log(userRef.data());
        let result = {
          idUser: args.idUser,
          username: userRef.data().username,
          email: userRef.data().email,
          password: "",
          verified: 1,
          waktu_pendaftaran: "",
          urlGambar: userRef.data().urlGambar,
        };
        console.log(result);
        return {
          code: 200,
          status: "Success",
          data: result,
        };
        //return {id: args.id,...userRef.data()}
      } catch (error) {
        console.log(error);
        let result = {
          id_user: args.id,
          username: "",
          email: "",
          password: "",
          verified: 0,
          waktu_pendaftaran: "",
          urlGambar: "",
        };
        return {
          code: 500,
          status: "Server Failed",
          data: result,
        };
      }
    },
    async masukUserGoogle(_, args) {
      const usersRef = firestore.collection("Users");
      const emailPengecekan = await usersRef
        .where("email", "==", args.email)
        .get();
      if (emailPengecekan.empty) {
        let idBaru = uuidv4().substring(0, 7);
        let user = {
          username: args.username,
          email: args.email,
          password: "",
          verified: true,
          waktu_pendaftaran: Timestamp.now(),
          isBanned: false,
          poin: 0,
          urlGambar: args.urlGambar,
        };
        const res = await firestore.collection("Users").doc(idBaru).set(user);
        return {
          pesan: "success",
          id: idBaru,
          code: 200,
        };
      } else {
        //cek jika pass kosong dulu
        //berhasil masuk
        let snapshot = emailPengecekan.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        let user = snapshot[0];
        if (user.password === "") {
          return {
            pesan: "success",
            id: user.id,
            code: 200,
          };
        } else {
          return {
            pesan: "Akun terdaftar bukan melalui google sign-in",
            id: "",
            code: 400,
          };
        }
      }
    },
    async kirimEmail(_, args) {
      try {
        const transporter = nodemailer.createTransport({
          service: "hotmail",
          port: 465,
          secure: false,
          logger: true,
          auth: {
            user: "kennylisal@hotmail.com",
            pass: "Ipshield21",
          },
        });

        const token = jwt.sign(
          {
            code: "TokenCode",
            idUser: args.idUser,
          },
          "KunciRahasia",
          { expiresIn: "100m" }
        );

        const mailConfigurations = {
          // It should be a string of sender/server email
          from: "kennylisal@hotmail.com",

          to: args.email,

          // Subject of Email
          subject: "Verifikasi Akun Hei. Survei",

          // This would be the text of email body
          // text: `Hi! There, You have recently visited
          //        our website and entered your email.
          //        Please follow the given link to verify your email
          //        http://localhost:3000/verify/${token}
          //        `
          text: `Klik link ini untuk verifikasi akun "Hei - Survei"
          https://verifikasi-heisurvei-dot-hei-survei-v1.et.r.appspot.com/verify/${token}
                 `,
        };
        //http://localhost:3001/graphql?query={kirimEmail{code}}
        //http://localhost:3001/graphql?query={kirimEmail{code}}
        transporter.sendMail(mailConfigurations, function (error, info) {
          if (error) {
            //throw Error(error);
            console.log(error);
            return {
              status: "500",
              data: "gagal",
              code: 500,
            };
          } else {
            console.log("Email Sent Successfully");
            console.log(info);
          }
        });

        return {
          status: "segsegkl",
          data: `http://localhost:3000/verify/${token}`,
          code: 200,
        };
      } catch (error) {
        console.log(error);
        return {
          status: "500",
          data: "gagal",
          code: 500,
        };
      }
    },
  },
  Mutation: {
    async updateUsername(_, args) {
      try {
        //ganti semua data
        let pengecekanRef = await firestore
          .collection("Users")
          .where("username", "==", args.username)
          .get();
        if (pengecekanRef.empty) {
          let userRef = await firestore
            .collection("Users")
            .doc(args.idUser)
            .update({
              username: args.username,
            });
          return {
            code: 200,
            status: "success",
            data: "Username berhasil dipakai",
          };
        } else {
          //disni
          return {
            code: 400,
            status: "failed",
            data: "Username telah dipakai",
          };
        }
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: "Terjadi kesalahan Server",
        };
      }
    },
    async updateFoto(_, args) {
      try {
        //ganti semua data
        let userRef = await firestore
          .collection("Users")
          .doc(args.idUser)
          .update({
            urlGambar: args.urlFoto,
          });
        return {
          code: 200,
          status: "success",
          data: "Gambar berhasil diUpdate",
        };
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: "Terjadi kesalahan Server",
        };
      }
    },
    async updatePassword(_, args) {
      try {
        //ganti semua data
        //cek password lama sudah sesuai tidak
        let cekRef = await firestore.collection("Users").doc(args.idUser).get();
        // const isMatch = await bcryptjs.compare(args.passwordLama, cekRef.data().password)
        const isMatch = true;
        if (isMatch) {
          let passCrypted = await bcryptjs.hash(args.password, 8);
          let userRef = await firestore
            .collection("Users")
            .doc(args.idUser)
            .update({
              password: passCrypted,
            });

          return {
            code: 200,
            status: "success",
            data: "Password berhasil diUpadte",
          };
        } else {
          return {
            code: 400,
            status: "failed",
            data: "Password lama tidak sesuai",
          };
        }
        //
      } catch (error) {
        console.log(error);
        return {
          code: 500,
          status: "failed",
          data: "Terjadi kesalahan Server",
        };
      }
    },
    async registerUser(_, args) {
      try {
        const usersRef = firestore.collection("Users");
        const emailPengecekan = await usersRef
          .where("email", "==", args.user.email)
          .get();
        // const userNamePengecekan = await usersRef.where("username", "==", args.user.username).get()
        //empty itu jika cari array
        //exist itu untuk satuan
        //console.log((new Date()).toLocaleDateString())
        if (!emailPengecekan.empty) {
          return {
            status: "failed",
            data: "Email telah digunakan",
            code: 400,
          };
        } else {
          let idBaru = uuidv4().substring(0, 7);
          let passCrypted = await bcryptjs.hash(args.user.password, 8);
          let user = {
            ...args.user,
            username: args.user.username,
            email: args.user.email,
            password: passCrypted,
            verified: true,
            waktu_pendaftaran: Timestamp.now(),
            isBanned: false,
            poin: 0,
            urlGambar:
              "https://firebasestorage.googleapis.com/v0/b/hei-survei-v1.appspot.com/o/profile%2Ffoto_awal.jpeg?alt=media&token=8d1eca2f-bb23-4403-8100-892a8c4a6dcf",
          };
          const res = await firestore
            .collection("Users")
            .doc(args.user.idUser)
            .set(user);
          console.log(res);
          return {
            status: "success",
            data: "User berhasil ditambahkan",
            code: 200,
          };
        }
      } catch (e) {
        return {
          status: "fail",
          data: "User gagal ditambahkan detail : " + e,
          code: 400,
        };
      }
    },
    async registerEx(_, args) {
      try {
        let idBaru = uuidv4().substring(0, 7);
        let user = {
          ...args.user,
          username: args.username,
          email: args.email,
          password: "",
          verified: true,
          waktu_pendaftaran: Timestamp.now(),
          isBanned: false,
          poin: 0,
          urlGambar:
            "https://firebasestorage.googleapis.com/v0/b/hei-survei-v1.appspot.com/o/profile%2Ffoto_awal.jpeg?alt=media&token=8d1eca2f-bb23-4403-8100-892a8c4a6dcf",
        };
        const res = await firestore.collection("Users").doc(idBaru).set(user);
        console.log(res);
        return {
          status: "success",
          data: "User berhasil ditambahkan",
          code: 200,
        };
      } catch (e) {
        return {
          status: "fail",
          data: "User gagal ditambahkan detail : " + e,
          code: 400,
        };
      }
    },
    async registerExPass(_, args) {
      try {
        let idBaru = uuidv4().substring(0, 7);
        let passCrypted = await bcryptjs.hash(args.password, 8);
        let user = {
          ...args.user,
          username: args.username,
          email: args.email,
          password: passCrypted,
          verified: true,
          waktu_pendaftaran: Timestamp.now(),
          isBanned: false,
          poin: 0,
          urlGambar:
            "https://firebasestorage.googleapis.com/v0/b/hei-survei-v1.appspot.com/o/profile%2Ffoto_awal.jpeg?alt=media&token=8d1eca2f-bb23-4403-8100-892a8c4a6dcf",
        };
        const res = await firestore.collection("Users").doc(idBaru).set(user);
        console.log(res);
        return {
          status: "success",
          data: "User berhasil ditambahkan",
          code: 200,
        };
      } catch (e) {
        console.log(e);
        return {
          status: "fail",
          data: "User gagal ditambahkan detail : " + e,
          code: 400,
        };
      }
    },
    async registerAp(_, args) {
      try {
        let idBaru = uuidv4().substring(0, 7);
        // let passCrypted = await bcryptjs.hash(args.password, 8)
        let user = {
          email: args.email,
          password: "",
          verified: true,
          waktu_pendaftaran: Timestamp.now(),
          tglLahir: Timestamp.now(),
          isBanned: false,
          isAuthenticated: false,
          kota: "",
          interest: [],
          urlGambar:
            "https://firebasestorage.googleapis.com/v0/b/hei-survei-v1.appspot.com/o/profile%2Ffoto_awal.jpeg?alt=media&token=8d1eca2f-bb23-4403-8100-892a8c4a6dcf",
          poin: 0,
        };
        const res = await firestore
          .collection("Users-survei")
          .doc(idBaru)
          .set(user);
        console.log(res);
        return {
          status: "success",
          data: "User berhasil ditambahkan",
          code: 200,
        };
      } catch (e) {
        console.log(e);
        return {
          status: "fail",
          data: "User gagal ditambahkan detail : " + e,
          code: 400,
        };
      }
    },
    async registerApPass(_, args) {
      try {
        let idBaru = uuidv4().substring(0, 7);
        let passCrypted = await bcryptjs.hash(args.password, 8);
        let user = {
          email: args.email,
          password: passCrypted,
          verified: true,
          waktu_pendaftaran: Timestamp.now(),
          tglLahir: Timestamp.now(),
          isBanned: false,
          isAuthenticated: false,
          kota: "",
          interest: [],
          urlGambar:
            "https://firebasestorage.googleapis.com/v0/b/hei-survei-v1.appspot.com/o/profile%2Ffoto_awal.jpeg?alt=media&token=8d1eca2f-bb23-4403-8100-892a8c4a6dcf",
          poin: 0,
        };
        const res = await firestore
          .collection("Users-survei")
          .doc(idBaru)
          .set(user);
        console.log(res);
        return {
          status: "success",
          data: "User berhasil ditambahkan",
          code: 200,
        };
      } catch (e) {
        console.log(e);
        return {
          status: "fail",
          data: "User gagal ditambahkan detail : " + e,
          code: 400,
        };
      }
    },
    async ubahTanggalMasuk(_, args) {
      try {
        //ambil data User
        const userRef = await firestore.collection("Users-survei").get();
        let userSnapShot = userRef.docs.map((doc) => {
          return { idUser: doc.id, ...doc.data() };
        });
        //ambil data jawaban
        const jawabanRef = await firestore
          .collection("jawaban-survei-v4")
          .where("idSurvei", "==", args.idSurvei)
          .get();
        let jawabanSnapshot = jawabanRef.docs.map((doc) => {
          return { idJawaban: doc.id, ...doc.data() };
        });

        let batch = firestore.batch();

        for (var i in jawabanSnapshot) {
          let idUserJawaban = jawabanSnapshot[i].idUser;
          let user = userSnapShot.find((x) => x.idUser === idUserJawaban);
          batch.update(
            firestore
              .collection("jawaban-survei-v4")
              .doc(jawabanSnapshot[i].idJawaban),
            {
              tglPengisian: user.waktu_pendaftaran,
            }
          );
        }

        await batch.commit();
        return {
          status: "success",
          data: "Data Berhasil Diubah",
          code: 200,
        };
      } catch (e) {
        console.log(e);
        return {
          status: "fail",
          data: "Gagal ganti jawaban : " + e,
          code: 400,
        };
      }
    },
  },
};

module.exports = { authResolver };
