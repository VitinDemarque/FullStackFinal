// src/routes/authGoogle.ts
import { Router } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';

const router = Router();

router.post('/google', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) return res.status(400).json({ message: 'Missing idToken' });

  try {
    // Valida o token com o Google
    const googleRes = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    );

    const { email, name, picture, sub: googleId } = googleRes.data;

    if (!email || !name || !googleId) {
      return res.status(400).json({ message: 'Invalid Google token payload' });
    }

    // Procura usuário existente
    let user = await User.findOne({ googleId });

    // Se não existir, cria novo usuário
    if (!user) {
      // Gera handle a partir do email, garantindo unicidade
      let baseHandle = email.split('@')[0].toLowerCase();
      let handle = baseHandle;
      let counter = 1;
      while (await User.findOne({ handle })) {
        handle = `${baseHandle}${counter++}`;
      }

      user = await User.create({
        name,
        email,
        handle,
        googleId,
        avatarUrl: picture || null,
        passwordHash: '', // não será usado
        level: 1,
        xpTotal: 0,
        role: 'USER',
      });
    }

    // Gera JWT (payload compatível com seu middleware)
    const payload = {
      sub: user._id.toString(),
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });

    // Retorna JWT + dados do usuário
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        handle: user.handle,
        email: user.email,
        avatarUrl: user.avatarUrl,
        level: user.level,
        xpTotal: user.xpTotal,
        role: user.role,
      },
    });
  } catch (err: any) {
    // Log error but don't expose details to client
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[authGoogle]', err.response?.data || err.message || err);
    }
    return res.status(400).json({ message: 'Invalid Google token' });
  }
});

export default router;