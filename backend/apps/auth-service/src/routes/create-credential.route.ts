import { Router } from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client/auth';
import { encoder } from '../services/token.services';
import { hash, generateSalt16 } from '../services/password.services';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  // Create new credentials and save to database
  const { userId, email, password, phoneNumber } = req.body;
  const salt = generateSalt16();
  const hashedPassword = hash(password, salt);
  try {
    const auth = await prisma.authRecord.create({
      data: {
        id: userId,
        email,
        password: hashedPassword,
        phoneNumber,
        salt: salt,
      },
    });
    res.json({
      meta: {
        message: 'Success',
        serviceId: 'auth-service',
        status: 200,
        isSuccess: true,
        extraMeta: {},
      },
      data: {
        id: userId,
        token: encoder(userId),
        refreshToken: encoder(userId),
        expired: 123,
      },
    });
  } catch (error) {
    res.json({
      meta: {
        message: error?.message,
        serviceId: 'auth-service',
        status: 400,
        isSuccess: false,
        extraMeta: {},
      },
      data: {},
    });
  }
});

export default router;
