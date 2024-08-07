import User from '../models/User';
import { Prices, PriceData } from '../dtypes';
import { fetchCryptoPrices } from './cryptoService';
import { Request, Response } from 'express';

export const checkAlerts = async () => {
    try{
  const users = await User.find({});
  const prices: Prices = await fetchCryptoPrices();
  console.log(users);
  console.log(typeof prices);

  let notifications:string[] = [];

  users.forEach((user) => {
    console.log(user.alerts);
    user.alerts.forEach((alert) => {
      const currentPrice = prices[alert.crypto]?.usd;
      console.log(currentPrice);
      console.log(typeof currentPrice);
      if (!currentPrice) return;

      const shouldNotify =
        (alert.direction === 'above' && currentPrice > alert.targetPrice) ||
        (alert.direction === 'below' && currentPrice < alert.targetPrice);

      if (shouldNotify) {
        // Send real-time alert to user (e.g., via WebSocket)
        console.log(`Notify ${user.email}: ${alert.crypto} is ${alert.direction} ${alert.targetPrice}`);
        notifications.push(`Notify ${user.email}: ${alert.crypto} is ${alert.direction} ${alert.targetPrice}`);
      }
    });
  });

  return notifications}
  catch(error){
    console.log(error)
    return -1;
  }
};

















