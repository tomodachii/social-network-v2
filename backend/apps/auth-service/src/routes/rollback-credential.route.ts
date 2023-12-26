import { PrismaClient } from '@prisma/client/auth';
import { Router } from 'express';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
const router = Router();

router.post('/', async (req, res) => {
  const { userId } = req.body;

  try {
    await prisma.authRecord.delete({
      where: {
        id: userId,
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
      data: {},
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
