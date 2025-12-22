import { Router } from "express";
import { PostController } from "@/controllers/post.controller.ts";
import { PostRepository } from "@/repositories/post.repository.ts";
import { PostService } from "@/services/post.service.ts";

const postRepository = new PostRepository();
const postService = new PostService(postRepository);
const postController = new PostController(postService);

const postRouter = Router();

postRouter.get("/", postController.getPosts);
postRouter.get("/:id", postController.getPost);
postRouter.post("/", postController.createPost);
postRouter.put("/:id", postController.updatePost);
postRouter.delete("/:id", postController.deletePost);

export default postRouter;
