import { Router, Request, Response } from 'express';

import DaoComentary from '../db/DaoComentary';
import Comentary from '../model/Comentary';
import Post from '../model/Post';
import User from '../model/User';

const router = Router();
const dao = new DaoComentary();

(async () => {
  await dao.initConnection();
})();

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const comentary = await dao.getComentary(id);
  if (comentary) {
    res.json(comentary);
  } else {
    res.status(404).json({ error: 'Comentary not found' });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  const comentaries = await dao.listComentaries();
  res.json(comentaries);
});

router.get('/post/:postId', async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);
  const post = new Post(postId, new Date(), ''); // só o id importa para buscar
  const comentaries = await dao.getComentariesFromPost(post);
  res.json(comentaries);
});

router.get('/user/:userId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const user = new User(userId, '', '', '', '', '', ''); // só o id importa
  const comentaries = await dao.getComentariesFromUser(user);
  res.json(comentaries);
});


router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const comentary = new Comentary(
      0, // id autogerado
      new Date(body.date),
      body.description
    );
    await dao.postComentary(comentary);
    res.status(201).json({ message: 'Comentary created successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err });
  }
});


router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const body = req.body;
    const updatedComentary = new Comentary(
      id,
      new Date(body.date),
      body.description
    );
    await dao.updateComentary(id, updatedComentary);
    res.json({ message: 'Comentary updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err });
  }
});


router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await dao.deleteComentaryById(id);
  res.json({ message: 'Comentary deleted successfully' });
});

export default router;
