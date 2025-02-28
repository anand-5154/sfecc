import express from 'express';
import { getContactPage, sendEmail } from '../controllers/contactController.js';

const router = express.Router();

router.get('/', getContactPage);
router.post('/', sendEmail);

export default router; 