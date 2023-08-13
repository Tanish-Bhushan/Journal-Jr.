const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  date_of_birth: Date,
  gender: String,
  e_mail: String,
  phone_number: Number,
  password: String,
  data: [{ user_title: String, user_data: String }],
});
userSchema.pre("save", async function (next) {
  //for hashing passwords
  //this.password
  if (this.isModified("password")) {
    const passwordhash = await bcrypt.hash(this.password, 10);
    this.password = passwordhash;
  }
  next();
});

const user = new mongoose.model("myuser", userSchema);
module.exports = user;
