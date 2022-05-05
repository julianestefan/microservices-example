import { Request, Response, NextFunction } from 'express';

import { NotAuthorizedError } from '../errors/NotAuthorizedError'
import { currentUser } from './currentUser';

export const checkAuth = [
    currentUser,
    (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new NotAuthorizedError;
        }

        next();
    }
]