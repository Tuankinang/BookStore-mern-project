const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Vui lòng nhập email hợp lệ"],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
  },
  phone: {
    type: String,
  },
  photoURL: {
    type: String,
  },
});

// https://www.npmjs.com/package/bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10); //To hash a password
  next();
});

// Method so sánh mật khẩu (Gọi trực tiếp từ instance user)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
