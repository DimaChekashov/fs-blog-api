import type { ZodQuery } from "@/models/endpoints.model.ts";
import {
  type CreatePostDto,
  type PaginatedPosts,
  type PostId,
  type UpdatePostDto,
} from "@/models/post.model.ts";
import type { UserId } from "@/models/user.model.ts";
import type { PostRepository } from "@/repositories/post.repository.ts";
import { ApiError } from "@/utils/errors.ts";

export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  getAllPosts = async (rawQuery: ZodQuery): Promise<PaginatedPosts> => {
    return this.postRepository.findAll(rawQuery);
  };

  getPost = async (postId: PostId) => {
    return this.postRepository.findOne(postId);
  };

  createPost = async (data: CreatePostDto, userId: UserId) => {
    return this.postRepository.create(data, userId);
  };

  updatePost = async (postId: PostId, userId: UserId, data: UpdatePostDto) => {
    const post = await this.postRepository.findOne(postId);

    if (post.authorId !== userId) {
      throw new ApiError(403, `You are not authorized to update this post`);
    }

    return this.postRepository.update(postId, data);
  };

  deletePost = async (postId: PostId, userId: UserId) => {
    const post = await this.postRepository.findOne(postId);

    if (post.authorId !== userId) {
      throw new ApiError(403, `You are not authorized to update this post`);
    }

    return this.postRepository.delete(postId);
  };
}
