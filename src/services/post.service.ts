import type { ZodQuery } from "@/models/endpoints.model.ts";
import {
  type CreatePostDto,
  type PaginatedPosts,
  type Post,
  type PostId,
  type UpdatePostDto,
} from "@/models/post.model.ts";
import type { UserId } from "@/models/user.model.ts";
import type { PostRepository } from "@/repositories/post.repository.ts";
import { ApiError } from "@/utils/errors.ts";

export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async getAllPosts(rawQuery: ZodQuery): Promise<PaginatedPosts> {
    return this.postRepository.findAll(rawQuery);
  }

  async getPost(postId: PostId): Promise<Post> {
    return this.postRepository.findOne(postId);
  }

  async createPost(data: CreatePostDto, userId: UserId): Promise<Post> {
    return this.postRepository.create(data, userId);
  }

  async updatePost(
    postId: PostId,
    userId: UserId,
    data: UpdatePostDto
  ): Promise<Post> {
    const post = await this.postRepository.findOne(postId);

    if (post.authorId !== userId) {
      throw new ApiError(403, `You are not authorized to update this post`);
    }

    return this.postRepository.update(postId, data);
  }

  async deletePost(postId: PostId, userId: UserId): Promise<Post> {
    const post = await this.postRepository.findOne(postId);

    if (post.authorId !== userId) {
      throw new ApiError(403, `You are not authorized to delete this post`);
    }

    return this.postRepository.delete(postId);
  }
}
