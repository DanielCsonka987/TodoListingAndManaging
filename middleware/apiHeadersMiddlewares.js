const generalHeaderConfig = require('../config/appConfig.js').headers;

module.exports = (req, res, next)=>{
  generalHeaderConfig.forEach((item, i) => {
    res.setHeader(item[0], item[1] );
  });
  next();
}
