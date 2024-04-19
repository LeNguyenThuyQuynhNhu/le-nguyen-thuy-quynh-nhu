import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

router.post('/register', UserController.register);
router.get('/users', UserController.getAllUsers);
router.get('/user', UserController.getUser);
router.put('/user', UserController.updateUser);
router.delete('/user', UserController.deleteUser);

export default router;