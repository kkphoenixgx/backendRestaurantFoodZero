import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import users from "./routes/user";
import reservation from './routes/reservation';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/users', users);
router.use('/reservations', reservation);

export default router;
