const express = require('express');

let app = express();

const PORT = process.env.PORT || 8080;


app.listen(PORT, ()=>{
  console.log(`Server online at port:${PORT}`);
});
