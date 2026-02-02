import express from 'express';
import { upload } from '../../midddleware/multer';
import { uploadFile } from './upload.controller';

const router = express.Router();

router.post('/', upload.single('file'), uploadFile);

export const uploadRouter = router;
