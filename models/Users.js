const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  token: String,
  expire: Date,
  image: String,
});

// Methods for hash the password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});


// Check if user already exists
UserSchema.post("save",  function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next('Ese correo ya esta registrado');
  } else {
    next(error);
  }
});

// Authenticate
UserSchema.methods = {
  comparedPassword: function(password){
    return bcrypt.compareSync(password, this.password);
  }
}

module.exports = mongoose.model("User", UserSchema);
