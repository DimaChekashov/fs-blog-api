import dotenv from "dotenv";
import express, { type Request, type Response } from "express";

const app = express();

app.use(express.json());

dotenv.config();

const posts = [
  {
    id: 1,
    title: "Hello World",
  },
];

app.get("/posts", (req: Request, res: Response) => {
  return res.json({ posts });
});

app.post("/posts", (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Send title field!" });
  }

  const newPost = {
    id: posts.length + 1,
    title,
  };

  posts.push(newPost);

  return res.status(201).json({ message: "Post created!", post: newPost });
});

app.put("/posts/:id", (req: Request, res: Response) => {
  const { title } = req.body;
  const id = req.params.id;

  if (!title) {
    return res.status(400).json({ error: "Send title field!" });
  } else if (title === "") {
    return res.status(400).json({ error: "Title must be filled!" });
  }

  if (id && typeof id === "string") {
    const idx = parseInt(id);

    if (isNaN(idx) || idx <= 0) {
      return res.status(400).json({
        error: "Invalid ID. Must be a positive number",
      });
    }

    if (idx > posts.length) {
      return res.status(400).json({
        error: `Post with ID ${id} not found`,
      });
    }

    posts[idx - 1] = {
      id: idx,
      title: title,
    };

    return res
      .status(200)
      .json({ message: "Post updated!", post: posts[idx - 1] });
  } else {
    return res.status(400).json({
      error: "ID parameter is required",
    });
  }
});

app.delete("/posts/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  if (id && typeof id === "string") {
    const idx = parseInt(id);

    if (isNaN(idx) || idx <= 0) {
      return res.status(400).json({
        error: "Invalid ID. Must be a positive number",
      });
    }

    if (idx > posts.length) {
      return res.status(400).json({
        error: `Post with ID ${id} not found`,
      });
    }

    const postIndex = posts.findIndex((post) => post.id === idx);
    if (postIndex !== -1) {
      posts.splice(postIndex, 1);
    }

    return res.status(200).json({ message: "Post deleted!" });
  } else {
    return res.status(400).json({
      error: "ID parameter is required",
    });
  }
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on http://localhost:${process.env.SERVER_PORT}`);
});
