import { Router } from 'express';
import User from '../models/User';
import { checkAlerts } from '../services/alertService';
import { authenticateJWT } from './auth';

const router = Router();
router.get('/check',async (req, res) => {
    try {
      const notifications = await checkAlerts();
      if (notifications [0]===null) {
        res.status(500).send({ message: 'Error checking alerts' });
      } else {
        res.status(200).send({ message: notifications.join(', ') });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error checking alerts' });
    }
  })
// Route to create a new alert
router.post('/create',authenticateJWT, async (req, res) => {
    console.log(req.user)
    const email= req.user;
    const {  crypto, targetPrice, direction } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ email, alerts: [] });
        }

        user.alerts.push({ crypto, targetPrice, direction });
        await user.save();

        res.status(201).json({ message: 'Alert created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create alert' });
    }
});

export default router;
