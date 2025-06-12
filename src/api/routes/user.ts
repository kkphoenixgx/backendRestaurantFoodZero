import { Router, Request, Response } from 'express';
import DaoUser from '../db/DaoUser';
import User from '../model/User';
import PasswordService from '../service/passwordService';
import { IAuthenticationResponse } from '../../interfaces/IAuthenticationResponse';

import fs from 'fs';
import multer from 'multer';
import path from 'path';

const router = Router();
const dao = new DaoUser();

(async () => {
  await dao.initConnection();
})();

const upload = multer({
  dest: 'public/uploads/',
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png'];
    if (!allowedExts.includes(ext)) {
      return cb(null, false); 
    }
    cb(null, true);
  }
});

function deleteOldImage(imagePath: string | null) {
  if (!imagePath) return;

  const fullPath = path.join(__dirname, '..', '..', 'public', imagePath);
  fs.unlink(fullPath, (err) => {
    if (err) console.error('Erro ao apagar imagem antiga:', err);
  });
}

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


router.post('/', upload.single('foto'), async (req: Request, res: Response) => {
  try {
    const { name, email, senha, phone, role } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Invalid or missing image file' });
    }

    const cryptedPassword = await PasswordService.encryptPassword(senha);
    const imagePath = `/uploads/${file.filename}`;

    const user = new User(0, name, email, cryptedPassword, imagePath, phone, role);

    await dao.postUser(user);
    res.status(201).json({ message: 'User created successfully' });

  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err });
  }
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const authResponse: IAuthenticationResponse = await dao.getUserHashAndId(email);

    if (!authResponse) return res.status(401).json({ error: 'Invalid email' });

    const isCorrectPassword = await PasswordService.comparePassword(authResponse.hash, senha);

    if (isCorrectPassword) {
      res.json({
        message: 'Logged in',
        user: await dao.getUser(authResponse.id)
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }

  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
});



router.put('/:id', upload.single('foto'), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email, senha, phone, role, userImagePath } = req.body;
    const file = req.file;

    const oldUser = await dao.getUser(id);
    if (!oldUser) return res.status(404).json({ error: 'User not found' });

    let imagePath: string | null = oldUser.userImagePath;


    if (typeof userImagePath !== 'undefined') {

      if (userImagePath === '' || userImagePath === null) {
        deleteOldImage(oldUser.userImagePath);
        imagePath = null;
      }

    }

    if (file) {
      deleteOldImage(oldUser.userImagePath);
      imagePath = `/uploads/${file.filename}`;
    }

    // Só criptografa a senha se ela foi enviada (não sobrescreve com senha vazia)
    let cryptedPassword = oldUser.senha;
    if (senha && senha.trim() !== '') {
      cryptedPassword = await PasswordService.encryptPassword(senha);
    }

    const updatedUser = new User(id, name, email, cryptedPassword, imagePath, phone, role);
    await dao.updateUser(id, updatedUser);

    res.json({ message: 'User updated successfully' });

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid data', details: err });
  }
});


router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = await dao.getUser(id);

  if (user?.userImagePath) {
    deleteOldImage(user.userImagePath);
  }

  await dao.deleteUserById(id);
  res.json({ message: 'User deleted successfully' });
});

export default router;
