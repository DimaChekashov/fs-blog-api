import dotenv from "dotenv";
import express from "express";
import postRouter from "./routes/post.router.ts";
import { errorHandler } from "./middlewares/error.middleware.ts";

const app = express();

app.use(express.json());

dotenv.config();

app.use("/posts", postRouter);

app.use(errorHandler);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on http://localhost:${process.env.SERVER_PORT}`);
});
