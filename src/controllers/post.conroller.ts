import type { Request, Response } from "express";
import type { PostService } from "@/services/post.service.ts";
import { validateQuery } from "@/middlewares/validate-query.middleware.ts";
import type { ZodQuery } from "@/models/endpoints.model.ts";

export class PostController {
  constructor(private readonly postService: PostService) {}

  getPosts = [
    validateQuery,
    async (req: Request, res: Response) => {
      const query = req.validatedQuery;
      const result = await this.postService.getAllPosts(query);

      res.status(200).json({
        success: true,
        data: result.posts,
        meta: {
          page: query.page,
          limit: query.limit,
          total: result.total,
          pages: Math.ceil(result.total / query.limit),
        },
      });
    },
  ];

  getPost = async (req: Request, res: Response) => {
    const { id } = req.params;

    const post = await this.postService.getPost({ id: parseInt(id as string) });

    res.status(200).json({
      success: true,
      data: post,
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
