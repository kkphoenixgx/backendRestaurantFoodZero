import { Router, Request, Response } from 'express';
import DaoTag from '../db/DaoTag';
import Tag from '../model/Tag';

const router = Router();
const dao = new DaoTag();

(async () => {
  await dao.initConnection();
})();

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const tag = await dao.getTag(id);
  if (tag) {
    res.json(tag);
  } else {
    res.status(404).json({ error: 'Tag not found' });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  const tags = await dao.listTags();
  res.json(tags);
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const tag = new Tag(0, body.name);
    await dao.postTag(tag);
    res.status(201).json({ message: 'Tag created successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const body = req.body;
    const updatedTag = new Tag(id, body.name);
    await dao.updateTag(id, updatedTag);
    res.json({ message: 'Tag updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await dao.deleteTagById(id);
  res.json({ message: 'Tag deleted successfully' });
});

export default router;