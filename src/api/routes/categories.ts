import { Router, Request, Response } from 'express';
import DaoCategory from '../db/DaoCategory';
import Category from '../model/Category';

const router = Router();
const dao = new DaoCategory();

(async () => {
  await dao.initConnection();
})();

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const category = await dao.getCategory(id);
  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  const categories = await dao.listCategories();
  res.json(categories);
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const category = new Category(0, body.name);
    await dao.postCategory(category);
    res.status(201).json({ message: 'Category created successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const body = req.body;
    const updatedCategory = new Category(id, body.name);
    await dao.updateCategory(id, updatedCategory);
    res.json({ message: 'Category updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await dao.deleteCategoryById(id);
  res.json({ message: 'Category deleted successfully' });
});

export default router;
