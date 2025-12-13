import type { Request, Response } from "express";
import type { PostService } from "@/services/post.service.ts";
import { validate } from "@/middlewares/validation.middleware.ts";
import z from "zod";
import { PostQuerySchema } from "@/models/post.model.ts";

export class PostController {
  constructor(private readonly postService: PostService) {}

  getPosts = [
    validate(z.object({ query: PostQuerySchema })),
    async (req: Request, res: Response) => {
      const posts = await this.postService.getAllPosts();

      res.status(200).json({
        success: true,
        data: posts,
        message: "Posts retrieved successfully",
      });
    },
  ];

  getPost = async (req: Request, res: Response) => {
    const { id } = req.params;

    const post = await this.postService.getPost({ id: parseInt(id as string) });

    res.status(200).json({
      success: true,
      data: post,
      message: "Post retrieved successfully",
    });
  };

  createPost = async (req: Request, res: Response) => {
    const { title } = req.body;

    const newPost = await this.postService.createPost({ title });

    res.status(201).json({
      success: true,
      data: newPost,
      message: "Post created successfully",
    });
  };

  updatePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title } = req.body;

    const updatedPost = await this.postService.updatePost({
      id: parseInt(id as string),
      title,
    });

    res.status(200).json({
      success: true,
      data: updatedPost,
      message: "Post updated successfully",
    });
  };

  deletePost = async (req: Request, res: Response) => {
    const { id } = req.params;

    const deletedPost = await this.postService.deletePost({
      id: parseInt(id as string),
    });

    res.status(200).json({
      success: true,
      data: deletedPost,
      message: "Post deleted successfully",
    });
  };
}
