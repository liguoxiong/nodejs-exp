import mongoose from "mongoose";

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB
} = process.env;

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

// const url = `mongodb://${MONGO_HOSTNAME}/${MONGO_DB}`;

const options = {
  useNewUrlParser: true,
  // reconnectTries: Number.MAX_VALUE,
  // reconnectInterval: 500,
  connectTimeoutMS: 10000,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

const databaseConnecter = async () => {
  try {
    await mongoose.connect(url, options);
    console.log("Database Connected");
  } catch (err) {
    console.error(err);
  }
};

export default databaseConnecter;
