import User from '../models/User';
import { Prices, PriceData } from '../dtypes';
import { fetchCryptoPrices } from './cryptoService';


export const checkAlerts = async () => {
    try{
  const users = await User.find({});
  const prices: Prices = await fetchCryptoPrices();
  //console.log(users);
  //console.log(typeof prices);

  let notifications:any= [];

  users.forEach((user) => {
    //console.log(user.alerts);
    user.alerts.forEach((alert) => {
      const currentPrice = prices[alert.crypto]?.usd;
      //console.log(currentPrice);
      //console.log(typeof currentPrice);
      if (!currentPrice) return;

      const shouldNotify =
        (alert.direction === 'above' && currentPrice > alert.targetPrice) ||
        (alert.direction === 'below' && currentPrice < alert.targetPrice);

      if (shouldNotify) {
        console.log(`Notify ${user.email}: ${alert.crypto} is ${alert.direction} ${alert.targetPrice}`);
        notifications.push({user:user.email,message: `${alert.crypto} is ${alert.direction} ${alert.targetPrice}`});
      }
    });
  });

  return notifications}
  catch(error){
    console.log(error)
    return [-1];
  }
};

















