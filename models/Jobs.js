const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slug");
const shortid = require("shortid");

const JobsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: "El nombre de la vancante es obligatorio",
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      required: "La ubicacion es obligatoria",
    },
    salary: {
      type: String,
      default: 0,
    },
    contract: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      lowercase: true,
    },
    skills: {
      type: [String],
    },
    candidate: [
      {
        name: String,
        email: String,
        cv: String,
      },
    ],
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: "El autor es obligatorio",
    },
  },
  {
    timestamps: true,
  },
);

JobsSchema.pre("save", function (next) {
  // Crear la url
  const url = slug(this.title);
  this.url = `${url}-${shortid.generate()}`;

  next();
});

module.exports = mongoose.model("Job", JobsSchema);
