import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google login route
router.post('/google-login', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { email, name, picture } = ticket.getPayload();
    const db = req.app.locals.db;

    // Check if user exists
    let [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    let user = users[0];

    if (!user) {
      // Create new user
      const result = await db.query(
        'INSERT INTO users (id, name, email, role) VALUES (UUID(), ?, ?, "user")',
        [name, email]
      );
      [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      user = users[0];
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: picture
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
});

export default router;