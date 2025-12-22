import type {
  Comment,
  CommentId,
  CreateCommentDto,
  PaginatedComments,
} from "@/models/comment.model.ts";
import type { ZodQuery } from "@/models/endpoints.model.ts";
import type { UserId } from "@/models/user.model.ts";
import type { CommentRepository } from "@/repositories/comment.repository.ts";
import type { PostRepository } from "@/repositories/post.repository.ts";
import { ApiError } from "@/utils/errors.ts";

export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository
  ) {}

  async getAllComments(rawQuery: ZodQuery): Promise<PaginatedComments> {
    return await this.commentRepository.findAll(rawQuery);
  }

  async createComment(
    commentData: CreateCommentDto,
    userId: UserId
  ): Promise<Comment> {
    await this.postRepository.findOne(commentData.postId);

    return await this.commentRepository.create(commentData, userId);
  }

  async deleteComment(commentId: CommentId, userId: UserId): Promise<Comment> {
    const comment = await this.commentRepository.findOne(commentId);

    if (comment.userId !== userId) {
      throw new ApiError(403, `You are not authorized to delete this comment`);
    }

    return await this.commentRepository.delete(commentId);
  }
}
