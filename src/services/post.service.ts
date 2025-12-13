import {
  GetPostDto,
  type CreatePostDto,
  type DeletePostDto,
  type UpdatePostDto,
} from "@/models/post.model.ts";
import type { PostRepository } from "@/repositories/post.repository.ts";

export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  getAllPosts = async () => {
    return this.postRepository.findAll();
  };

  getPost = async (data: GetPostDto) => {
    return this.postRepository.findOne(data);
  };

  createPost = async (data: CreatePostDto) => {
    return this.postRepository.create(data);
  };

  updatePost = async (data: UpdatePostDto) => {
    return this.postRepository.update(data);
  };

  deletePost = async (data: DeletePostDto) => {
    return this.postRepository.delete(data);
  };
}
