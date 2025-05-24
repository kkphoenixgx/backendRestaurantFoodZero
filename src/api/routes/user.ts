import { Router, Request, Response } from 'express';

import DaoUser from '../db/DaoUser';
import User from '../model/User';

const router = Router();
const dao = new DaoUser();

(async () => {
  await dao.initConnection();
})();

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = await dao.getUser(id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  const users = await dao.listUsers();
  res.json(users);
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const user = new User(
      0, // id será autogerado
      body.name,
      body.email,
      body.senha,
      body.userImagePath,
      body.phone,
      body.role,
    );

    await dao.postUser(user);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const body = req.body;

    const updatedUser = new User(
      id,
      body.name,
      body.email,
      body.senha,
      body.userImagePath,
      body.phone,
      body.role,
    );

    await dao.updateUser(id, updatedUser);
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await dao.deleteUserById(id);
  res.json({ message: 'User deleted successfully' });
});

export default router;
