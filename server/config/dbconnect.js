import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    if (db.connection.readyState === 1)
      console.log("DB is connected successfully");
    else if (db.connection.readyState === 2) console.log("DB is connecting");
    else if (db.connection.readyState === 3) console.log("DB is disconnecting");
    else {
      console.log("DB is disconnected");
    }
  } catch (error) {
    console.log("Connect to DB failed");
    throw new Error(error);
  }
};

export default dbConnect;
