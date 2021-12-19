import { connect } from "mongoose";

export const ConnectDB = async () => {
  return await connect(process.env.DB_URL)
    .then(() => {
      console.log("🚀 Conexión exitosa a la base de datos");
    })
    .catch((e) => {
      console.error("🆘 Error conectando a la base de datos", e);
    });
};
