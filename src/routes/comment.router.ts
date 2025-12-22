import { Router } from "express";
import { CommentController } from "@/controllers/comment.controller.ts";
import { CommentRepository } from "@/repositories/comment.repository.ts";
import { CommentService } from "@/services/comment.service.ts";
import { PostRepository } from "@/repositories/post.repository.ts";

const commentRepository = new CommentRepository();
const postRepository = new PostRepository();
const commentService = new CommentService(commentRepository, postRepository);
const commentController = new CommentController(commentService);

const commentRouter = Router();

commentRouter.get("/", commentController.getComments);
commentRouter.post("/", commentController.createComment);
commentRouter.delete("/:id", commentController.deleteComment);

export default commentRouter;
