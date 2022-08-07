const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    schSenderEmail: {
      type: String
    },
    schSenderName: {
      type: String
    },
    schDate: {
      type: String,
      required: [true, 'Specify the date!']
    },
    schTime: {
      type: String
    },
    schType: {
      type: String
    },
    schPhone: {
      type: String
    },
    createdAt: {
      type: Date
    },
    service: {
      type: String
    },
    inProgress: {
      type: Boolean,
      default: false
    },
    doneSessions: {
      type: Number
    },
    remainingSessions: {
      type: Number
    },
    complete: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

scheduleSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
