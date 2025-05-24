import { Router, Request, Response } from 'express';
import DaoPlate from '../db/DaoPlate';
import Plate from '../model/Plate';

const router = Router();
const dao = new DaoPlate();

(async () => {
  await dao.initConnection();
})();

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const plate = await dao.getPlate(id);
  if (plate) {
    res.json(plate);
  } else {
    res.status(404).json({ error: 'Plate not found' });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  const plates = await dao.listPlates();
  res.json(plates);
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
    await dao.postPlate(plate);
    res.status(201).json({ message: 'Plate created successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err });
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
    await dao.updatePlate(id, updatedPlate);
    res.json({ message: 'Plate updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await dao.deletePlateById(id);
  res.json({ message: 'Plate deleted successfully' });
});

export default router;
