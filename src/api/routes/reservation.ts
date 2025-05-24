import { Router, Request, Response } from 'express';

import DaoReservation from '../db/DaoReservation';

import Reservation from '../model/Reservation';
import User from '../model/User';

const router = Router();
const dao = new DaoReservation();

(async () => {
  await dao.initConnection();
})();

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const reservation = await dao.getReservation(id);
  if (reservation) {
    res.json(reservation);
  } else {
    res.status(404).json({ error: 'Reservation not found' });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  const reservations = await dao.listReservations();
  res.json(reservations);
});


router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const user = new User(
      body.user.id,
      body.user.name,
      body.user.email,
      body.user.senha,
      body.user.userImagePath,
      body.user.phone,
      body.user.role,
    );

    const reservation = new Reservation(
      0, // id será autogerado
      new Date(body.reservationTime),
      body.personsQuantity,
      user,
    );

    await dao.postReservation(reservation);
    res.status(201).json({ message: 'Reservation created successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err });
  }
});


router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const body = req.body;

    const user = new User(
      body.user.id,
      body.user.name,
      body.user.email,
      body.user.senha,
      body.user.userImagePath,
      body.user.phone,
      body.user.role,
    );

    const reservation = new Reservation(
      id,
      new Date(body.reservationTime),
      body.personsQuantity,
      user,
    );

    await dao.updateReservation(id, reservation);
    res.json({ message: 'Reservation updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err });
  }
});


router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await dao.deleteReservationById(id);
  res.json({ message: 'Reservation deleted successfully' });
});

export default router;
