import express from 'express';
import controller from './controller';
import auth from "../../../../helper/auth";

const router = express.Router();

router.use(auth.verifyToken);

export default router;