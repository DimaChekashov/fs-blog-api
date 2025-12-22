import { Router } from "express";
import { PostController } from "@/controllers/post.controller.ts";
import { PostRepository } from "@/repositories/post.repository.ts";
import { PostService } from "@/services/post.service.ts";

const postRepository = new PostRepository();
const postService = new PostService(postRepository);
const postController = new PostController(postService);

const postRouter = Router();

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Number of page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Count of posts on page
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */
postRouter.get("/", postController.getPosts);
postRouter.get("/:id", postController.getPost);
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 example: New post title
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 example: New post description...
 *     responses:
 *       201:
 *         description: Пост успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
postRouter.post("/", postController.createPost);
postRouter.put("/:id", postController.updatePost);
postRouter.delete("/:id", postController.deletePost);

export default postRouter;
