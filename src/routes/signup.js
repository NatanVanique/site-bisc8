const express = require('express');
const router = express.Router();
const pool = require('../scripts/db');

router.post('/signup', async (req, res) => {
  const { email, gamename } = req.body;
  if (!email || !gamename) {
    return res.status(400).json({ error: 'email and gamename are required' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO newsletter (email, gamename)
       VALUES ($1, $2)
       RETURNING id, email, gamename, datecreated`,
      [email, gamename]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'email already subscribed' });
    }
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

module.exports = router;