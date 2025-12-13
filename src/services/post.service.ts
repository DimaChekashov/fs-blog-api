import type { ZodQuery } from "@/models/endpoints.model.ts";
import {
  type CreatePostDto,
  type PaginatedPosts,
  type UpdatePostDto,
} from "@/models/post.model.ts";
import type { PostRepository } from "@/repositories/post.repository.ts";

export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  getAllPosts = async (rawQuery: ZodQuery): Promise<PaginatedPosts> => {
    return this.postRepository.findAll(rawQuery);
  };

  getPost = async (id: number) => {
    return this.postRepository.findOne(id);
  };

  createPost = async (data: CreatePostDto) => {
    return this.postRepository.create(data);
  };

  updatePost = async (id: number, data: UpdatePostDto) => {
    await this.postRepository.findOne(id);

    return this.postRepository.update(id, data);
  };

  deletePost = async (id: number) => {
    await this.postRepository.findOne(id);

    return this.postRepository.delete(id);
  };
}
