require("dotenv").config();
import express = require("express");
import cors = require("cors");
import morgan = require("morgan");
import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import authRouter from "./modules/auth/authRouter";

import userRouter from "./modules/user/userRouter";
import { dbConnection } from "./utils/dbConnection";
import isAuthenticated from "./middlewares/auth";
const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'));

if (process.env.NO_DB === "true") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} else {
  dbConnection()
    .then(() => {
      console.log("Database connected");
      app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(req.originalUrl, "\t", req.method, "\t", req.url);
  next();
});

// router middlewares
app.use("/auth", authRouter);
app.use("/user", isAuthenticated, userRouter);

app.get("/", (req, res) => {
  res.send("Hello world");
});
