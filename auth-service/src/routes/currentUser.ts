import express from 'express';
import { currentUser } from '@gearthlogic/common';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  currentUser,
  (req, res) => {
    return res.send(req.user);
  }
);

export { router as currentUserRouter };
