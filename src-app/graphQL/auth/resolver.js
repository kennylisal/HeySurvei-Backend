const firebase = require("../../../db");
const firestore = firebase.firestore();
const authResolver = {
  Query: {
    async kirimSMS(_, args) {
      const accountSid = process.env.accountSid;
      const authToken = process.env.authToken;
      const client = require("twilio")(accountSid, authToken);
      client.messages
        .create({
          body: "Hello from twilio-node",
          to: "+6287842231729", // Text your number
          from: "+19087414150", // From a valid Twilio number
        })
        .then((message) => console.log(message.sid))
        .catch((err) => console.log(err));

      return {
        status: "200",
        pesan: "percobaan selesai",
        code: 200,
      };
    },
    async loginUser(_, args) {
      try {
        const userRef = await firestore
          .collection("Users-survei")
          .where("email", "==", args.email)
          .get();
        if (!userRef.empty) {
          let snapshot = userRef.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });
          let user = snapshot[0];
          console.log(user);
          const isMatch = await bcryptjs.compare(args.password, user.password);
          if (isMatch) {
            if (user.verified) {
              return {
                status: "success",
                pesan: "Berhasil masuk",
                code: 200,
                data: user.id,
              };
            } else {
              return {
                status: "failed",
                pesan: "Verifikasi email anda terlebih dahulu",
                code: 400,
                data: "",
              };
            }
          } else {
            return {
              status: "failed",
              pesan: "Kredensial Tidak Sesuai",
              code: 400,
              data: "",
            };
          }
        } else {
          return {
            status: "failed",
            pesan: "Kredensial tidak ditemukan",
            code: 400,
            data: "",
          };
        }
      } catch (error) {
        return {
          status: "failed",
          pesan: "Terjadi kesalahan server",
          code: 500,
          data: "",
        };
      }
    },
    async loginGoogle() {
      try {
        const usersRef = firestore.collection("Users-survei");
        const emailPengecekan = await usersRef
          .where("email", "==", args.email)
          .get();
        if (!emailPengecekan.empty) {
          //ini situasi kalau sudah ada dibikin datanya
          return {
            status: "success",
            pesan: "Data sudah ada",
            code: 201,
          };
        } else {
          let idBaru = uuidv4().substring(0, 7);
          let user = {
            email: args.email,
            password: "",
            verified: true,
            waktu_pendaftaran: Timestamp.now(),
            isBanned: false,
            kota: "",
            interest: [],
          };
          const res = await firestore
            .collection("Users-survei")
            .doc(idBaru)
            .set(user);
          console.log(res);
          return {
            status: "success",
            pesan: "Data tambahan telah dibuat",
            code: 200,
          };
        }
      } catch (error) {
        console.log(error);
        return {
          status: "success",
          pesan: "Terjadi Kesalahan Server",
          code: 500,
        };
      }
    },
    async getDataUser(_, args) {
      try {
        const userRef = await firestore
          .collection("Users-survei")
          .doc(args.idUser)
          .get();
        console.log(userRef.data());

        let result = {
          id_user: args.id,
          email: userRef.data().email,
          password: "",
          verified: userRef.data().verified,
          waktu_pendaftaran: userRef.data().waktu_pendaftaran,
          isBanned: userRef.data().isBanned,
          kota: userRef.data().kota,
          interest: userRef.data().interest,
          url_gambar: userRef.data().urlGambar,
          isAuthenticated: userRef.data().isAuthenticated,
          poin: userRef.data().poin,
          tglLahir: userRef.data().tglLahir,
        };
        result.waktu_pendaftaran = result.waktu_pendaftaran._seconds;
        result.tglLahir = result.tglLahir._seconds;
        return {
          code: 200,
          pesan: "Berhasil Ambil Data User",
          data: result,
        };
      } catch (error) {
        return {
          code: 500,
          pesan: "Terjadi eeror" + error,
          data: null,
        };
      }
    },
  },
  Mutation: {
    async kirimSmsAuth(_, args) {
      try {
        //amibl kode autentikasinya
        //bikin kode baru\
        let batch = firestore.batch();
        let angkaRandom = Math.floor(Math.random() * 1000000).toString();
        let idBaru = uuidv4().substring(0, 7);

        batch.set(
          firestore.collection("autentikasi-user-app").doc(args.idUser),
          {
            kodeAuth: angkaRandom,
          }
        );

        batch.update(firestore.collection("Users-survei").doc(args.idUser), {
          noHP: args.noHP,
        });

        const accountSid = process.env.accountSid;
        const authToken = process.env.authToken;
        const client = require("twilio")(accountSid, authToken);
        let isSuccess = false;
        await client.messages
          .create({
            body: "Kode Autentikasi Akun Hei-Survei anda adalah " + angkaRandom,
            to: "+62" + args.noHP, // Text your number
            from: "+14793485757", // From a valid Twilio number
          })
          .then((message) => {
            console.log(message.sid);
            isSuccess = true;
          })
          .catch((err) => {
            console.log(err);
            isSuccess = false;
          });
        if (isSuccess) {
          await batch.commit();
          return {
            status: "200",
            pesan: "OTP berhasil terkirim",
            code: 200,
          };
        } else {
          return {
            status: "200",
            pesan: "No HP tidak benar",
            code: 400,
          };
        }

        //kirim sms
      } catch (error) {
        return {
          status: "fail",
          pesan: "Terjadi kesalah Server: " + error,
          code: 500,
        };
      }
    },
    async autentikasiKodeSms(_, args) {
      try {
        let autentikasiRef = await firestore
          .collection("autentikasi-user-app")
          .doc(args.idUser)
          .get();

        if (autentikasiRef.data().kodeAuth == args.kode) {
          let batch = firestore.batch();
          batch.update(firestore.collection("Users-survei").doc(args.idUser), {
            isAuthenticated: true,
          });
          await batch.commit();
          return {
            status: "success",
            pesan: "Kode autentikasi benar",
            code: 200,
          };
        } else {
          return {
            status: "failed",
            pesan: "Kode autentikasi salah",
            code: 400,
          };
        }
      } catch (error) {
        console.log(error);
        return {
          status: "failed",
          pesan: "Terjadi Kesalahan Server",
          code: 500,
        };
      }
    },
    async registerUser(_, args) {
      try {
        const usersRef = firestore.collection("Users-survei");
        const emailPengecekan = await usersRef
          .where("email", "==", args.email)
          .get();
        if (!emailPengecekan.empty) {
          return {
            status: "failed",
            pesan: "Email telah digunakan",
            code: 400,
          };
        } else {
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
          let batch = firestore.batch();

          batch.create(firestore.collection("Users-survei").doc(idBaru), user);

          batch.create(
            firestore.collection("autentikasi-user-app").doc(idBaru),
            {
              kodeAuth: 0,
            }
          );

          // const res = await firestore.collection("Users-survei").doc(idBaru).set(user)
          // console.log(res)
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
              code: "KunciAppSurvei",
              idUser: idBaru,
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
            text: `Selamat datang di Hei-Survei, silahkan klik link dibawah untuk verifikasi 
                        https://verifikasi-heisurvei-dot-hei-survei-v1.et.r.appspot.com/verify-userApp/${token}
                               `,
          };

          transporter.sendMail(mailConfigurations, function (error, info) {
            if (error) {
              //throw Error(error);
              console.log(error);
              return {
                status: "500",
                pesan: "Terjadi Kesalahan Server",
                code: 500,
              };
            } else {
              console.log("Email Sent Successfully");
              console.log(info);
            }
          });
          await batch.commit();
          return {
            status: "success",
            pesan: "Berhasil Daftar, Silahkan Verifikasi email",
            code: 200,
          };
        }
      } catch (error) {
        console.log(error);
        return {
          status: "500",
          pesan: "terjadi kesalahan server",
          code: 500,
        };
      }
    },
    async registerUserGoogle(_, args) {
      try {
        const userRef = await firestore
          .collection("Users-survei")
          .where("email", "==", args.email)
          .get();
        if (userRef.empty) {
          let idBaru = uuidv4().substring(0, 7);
          let userBaru = {
            email: args.email,
            password: "",
            verified: true,
            waktu_pendaftaran: Timestamp.now(),
            isBanned: false,
            kota: "",
            interest: [],
            urlGambar: args.urlGambar,
            tglLahir: Timestamp.now(),
            isAuthenticated: false,
            poin: 0,
          };
          const res = await firestore
            .collection("Users-survei")
            .doc(idBaru)
            .set(userBaru);
          return {
            status: "success",
            pesan: "Berhasil masuk",
            code: 200,
            data: idBaru,
          };
        } else {
          let snapshot = userRef.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });
          let user = snapshot[0];
          if (user.password === "") {
            return {
              status: "success",
              pesan: "Berhasil masuk",
              code: 200,
              data: user.id,
            };
          } else {
            return {
              status: "failed",
              pesan: "Akun google tidak kredibel",
              code: 400,
              data: "",
            };
          }
        }
      } catch (error) {
        return {
          status: "failed",
          pesan: "Terjadi kesalahan server",
          code: 500,
          data: "",
        };
      }
    },
  },
};

module.exports = { authResolver };
