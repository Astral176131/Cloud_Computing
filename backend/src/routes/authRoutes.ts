import { Router } from 'express';
import { register, login, validateRegister, validateLogin } from '../controllers/authController';
import { Request, Response, NextFunction } from 'express';

const router = Router();

router.post('/register', validateRegister, (req: Request, res: Response, next: NextFunction) => {
  register(req, res).catch(next);
});

router.post('/login', validateLogin, (req: Request, res: Response, next: NextFunction) => {
  login(req, res).catch(next);
});

export default router;