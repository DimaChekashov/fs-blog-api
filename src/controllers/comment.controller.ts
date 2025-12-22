import { auth } from "@/middlewares/auth.middleware.ts";
import { validateBody } from "@/middlewares/validate-body.middleware.ts";
import { validateParams } from "@/middlewares/validate-params.middleware.ts";
import { validateQuery } from "@/middlewares/validate-query.middleware.ts";
import {
  CommentParamsSchema,
  CreateCommentSchema,
  type CommentParams,
} from "@/models/comment.model.ts";
import type { CommentService } from "@/services/comment.service.ts";
import type { Request, Response } from "express";

export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  getComments = [
    validateQuery,
    async (req: Request, res: Response) => {
      const query = req.validatedQuery;
      const result = await this.commentService.getAllComments(query);

      res.status(200).send({
        success: true,
        data: result.comments,
        meta: {
          page: query.page,
          limit: query.limit,
          total: result.total,
          pages: Math.ceil(result.total / query.limit),
        },
      });
    },
  ];

  createComment = [
    auth,
    validateBody(CreateCommentSchema),
    async (req: Request, res: Response) => {
      const commentData = req.body;
      const { sub: userId } = req.user;

      const newComment = await this.commentService.createComment(
        commentData,
        userId
      );

      res.status(201).json({
        success: true,
        data: newComment,
      });
    },
  ];

  deleteComment = [
    auth,
    validateParams(CommentParamsSchema),
    async (req: Request, res: Response) => {
      const { id: commentId } = req.validatedParams as CommentParams;
      const { sub: userId } = req.user;

      const deletedComment = await this.commentService.deleteComment(
        commentId,
        userId
      );

      res.status(200).json({
        success: true,
        data: deletedComment,
      });
    },
  ];
}
