import dotenv from "dotenv";
import express from "express";
import postRouter from "./routes/post.router.ts";
import { errorHandler } from "./middlewares/error.middleware.ts";
import authRouter from "./routes/auth.router.ts";
import commentRouter from "./routes/comment.router.ts";
import { setupSwagger } from "./config/swagger.ts";

const app = express();

app.use(express.json());

setupSwagger(app);

dotenv.config();

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

app.use(errorHandler);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on http://localhost:${process.env.SERVER_PORT}`);
});
