import type { Request, Response } from "express";
import type { PostService } from "@/services/post.service.ts";
import { validateQuery } from "@/middlewares/validate-query.middleware.ts";
import { validateBody } from "@/middlewares/validate-body.middleware.ts";
import {
  CreatePostSchema,
  PostParamsSchema,
  UpdatePostSchema,
  type PostParams,
} from "@/models/post.model.ts";
import { validateParams } from "@/middlewares/validate-params.middleware.ts";

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

  getPost = [
    validateParams(PostParamsSchema),
    async (req: Request, res: Response) => {
      const { id } = req.validatedParams as PostParams;

      const post = await this.postService.getPost(id);

      res.status(200).json({
        success: true,
        data: post,
      });
    },
  ];

  createPost = [
    validateBody(CreatePostSchema),
    async (req: Request, res: Response) => {
      const postData = req.body;

      const newPost = await this.postService.createPost(postData);

      res.status(201).json({
        success: true,
        data: newPost,
      });
    },
  ];

  updatePost = [
    validateParams(PostParamsSchema),
    validateBody(UpdatePostSchema),
    async (req: Request, res: Response) => {
      const { id } = req.validatedParams as PostParams;
      const updateData = req.body;

      const updatedPost = await this.postService.updatePost(id, updateData);

      res.status(200).json({
        success: true,
        data: updatedPost,
      });
    },
  ];

  deletePost = [
    validateParams(PostParamsSchema),
    async (req: Request, res: Response) => {
      const { id } = req.validatedParams as PostParams;

      const deletedPost = await this.postService.deletePost(id);

      res.status(200).json({
        success: true,
        data: deletedPost,
      });
    },
  ];
}
