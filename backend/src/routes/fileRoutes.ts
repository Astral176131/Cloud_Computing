// src/routes/fileRoutes.ts
import { Router } from 'express';
import { uploadFile, getFile, getUserFiles } from '../controllers/fileController';
import authMiddleware from '../middleware/authMiddleware';
import multer from 'multer';

const upload = multer();
const router = Router();

// Apply auth middleware to all file routes
router.use(authMiddleware);

// File routes
router.post('/', upload.single('file'), uploadFile);
router.get('/', getUserFiles);
router.get('/:id', getFile);

export default router;