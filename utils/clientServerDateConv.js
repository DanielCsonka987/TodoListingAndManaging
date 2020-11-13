function getClientProperDatetime_ms(clientOffset_min){
  const serverDatetime = new Date();
  const serverTimezoneOffset_ms = serverDatetime.getTimezoneOffset() * 60000;
  //(x * 60s*1000ms) (x min|x 660 >= x >= -660)
  // (x|x is the difference to get GMT in min)
  // console.log("Server offset (min): ", serverTimezoneOffset_ms/60000);
  const serverUTC_ms = serverDatetime.getTime() + serverTimezoneOffset_ms; //Coordinated Universal Time
  // console.log("Server UTC (date): ", new Date(serverUTC_ms).toLocaleString());

  const finalClientDate_ms = serverUTC_ms - (clientOffset_min * 60000);
  //utc + (x * 60s*1000ms) (x min|x 660 >= x >= -660)
  //(x|x is the clientOffset, client difference to GMT in min)
  // console.log('Client real Datetime: ', new Date(finalClientDate_ms).toLocaleString());
  return finalClientDate_ms;
}

module.exports = getClientProperDatetime_ms;
