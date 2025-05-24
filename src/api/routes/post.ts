import { Router, Request, Response } from 'express';
import DaoPost from '../db/DaoPost';
import Post from '../model/Post';

const router = Router();
const dao = new DaoPost();

(async () => {
  await dao.initConnection();
})();

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const post = await dao.getPost(id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  const posts = await dao.listPosts();
  res.json(posts);
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const post = new Post(
      0,
      new Date(body.date),
      body.description
    );

    await dao.postPost(post);
    res.status(201).json({ message: 'Post created successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const body = req.body;

    const updatedPost = new Post(
      id,
      new Date(body.date),
      body.description
    );

    await dao.updatePost(id, updatedPost);
    res.json({ message: 'Post updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await dao.deletePostById(id);
  res.json({ message: 'Post deleted successfully' });
});

export default router;
