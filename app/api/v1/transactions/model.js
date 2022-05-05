const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    personalDetail: {
      firstName: {
        type: String,
        required: [true, "Please provide firstName"],
        minlength: 3,
        maxlength: 50,
      },
      lastName: {
        type: String,
        required: [true, "Please provide lastName"],
        minlength: 3,
        maxlength: 50,
      },
      email: {
        type: String,
        required: [true, "Please provide email"],
      },
      role: {
        type: String,
        default: "Designer",
      },
    },

    participant: {
      type: mongoose.Types.ObjectId,
      ref: "Participant",
      required: true,
    },
    event: {
      type: mongoose.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    historyEvent: {
      title: {
        type: String,
        required: [true, "Please provide title"]
      },
      price: {
        type: Number,
        default: 0,
      },
      date: {
        type: Date,
        required: [true, "Please Provide Date"],
      },
      cover: {
        type: String,
        required: [true, "Please Provide Cover"],
      },
      about: {
        type: "string",
        required: [true, "Please Provide about"],
      },
      venueName: {
        type: String,
        required: [true, "please provide venue name"],
      },
      tagLine: {
        type: String,
        required: [true, "Please provie tagline"],
      },
      keyPoint: {
        type: [String],
        // required: [true, 'Please provide Keypoint']
      },
      category: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: true,
      },
      
    },
    payment : {
      type: mongoose.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    historyPayment: {
      type: {
        type: String,
        required: [true, 'Please provide type'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Please provide imageUrl'],
    },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
