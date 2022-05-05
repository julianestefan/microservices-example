import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationHandler, BadRequestError } from '@gearthlogic/common';

import { User } from '../models/User';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
  ],
  validationHandler,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) throw new BadRequestError('invalid email');

    if (!await bcrypt.compare(password, existingUser.password)) {
      throw new BadRequestError('invalid password');
    }
    
    const userJWT = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_SECRET!);

    req.session = { jwt: userJWT };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
