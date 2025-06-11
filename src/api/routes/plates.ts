import { Router, Request, Response } from 'express';
import DaoPlate from '../db/DaoPlate';
import DaoPlateCategory from '../db/DaoPlateCategory';
import Plate from '../model/Plate';

const router = Router();
const plateDao = new DaoPlate();
const plateCategoryDao = new DaoPlateCategory();

(async () => {
  await plateDao.initConnection();
  await plateCategoryDao.initConnection();
})();

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const plate = await plateDao.getPlate(id);
  if (plate) {
    res.json(plate);
  } else {
    res.status(404).json({ error: 'Plate not found' });
  }
});
router.get('/', async (_req: Request, res: Response) => {
  const plates = await plateDao.listPlates();
  res.json(plates);
});
router.get('/:id/categories', async (req: Request, res: Response) => {
  const plateId = parseInt(req.params.id);
  try {
    const categoryIds = await plateCategoryDao.getCategoriesByPlate(plateId);
    res.json(categoryIds);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get categories', details: err });
  }
});
router.get('/category/:categoryId', async (req: Request, res: Response) => {
  const categoryId = parseInt(req.params.categoryId);
  try {
    const plateIds = await plateCategoryDao.getPlatesByCategory(categoryId);
    const plates = await Promise.all(plateIds.map(id => plateDao.getPlate(id)));

    res.json(plates.filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: 'Failed to get plates', details: err });
  }
});


router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const plate = new Plate(
      0,
      body.name,
      Number(body.value),
      body.description,
      body.imagePath
    );

    const plateId = await plateDao.postPlate(plate, body.categoryIds ? body.categoryIds : []);

    res.status(201).json({ message: 'Plate created successfully', plateId });
  } catch (err) {
    console.error('Erro ao criar prato:', err);
    res.status(400).json({ 
      error: 'Invalid data', 
      details: err instanceof Error ? { message: err.message, stack: err.stack } : err 
    });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const body = req.body;
    const updatedPlate = new Plate(
      id,
      body.name,
      Number(body.value),
      body.description,
      body.imagePath
    );

    await plateDao.updatePlate(id, updatedPlate);

    if (Array.isArray(body.categoryIds)) {

      const oldCategoryIds = await plateCategoryDao.getCategoriesByPlate(id);
      for (const oldId of oldCategoryIds) {
        await plateCategoryDao.removeAssociation(id, oldId);
      }

      for (const newId of body.categoryIds) {
        await plateCategoryDao.associate(id, newId);
      }
    }

    res.json({ message: 'Plate updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const categoryIds = await plateCategoryDao.getCategoriesByPlate(id);
  for (const categoryId of categoryIds) {
    await plateCategoryDao.removeAssociation(id, categoryId);
  }

  await plateDao.deletePlateById(id);
  res.json({ message: 'Plate deleted successfully' });
});

export default router;
