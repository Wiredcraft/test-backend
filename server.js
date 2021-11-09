const mongoose = require('mongoose');
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });


const DB = process.env.DATABASE;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() =>  console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
app.listen(port, (err) => {
  if (err) console.log("Error in Server setup");
  console.log(`listening to port ${port}`);
});