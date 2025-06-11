import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';

import users from "./routes/user";
import reservation from './routes/reservation';
import categories from './routes/categories';
import comentaries from './routes/comentaries';
import plates from './routes/plates';
import posts from './routes/post';
import tags from './routes/tags';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/users', users);
router.use('/reservations', reservation);
router.use('/categories', categories);
router.use('/comentaries', comentaries);
router.use('/plates', plates);
router.use('/posts', posts);
router.use('/tags', tags);


export default router;
