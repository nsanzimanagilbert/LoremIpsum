const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: [true, 'Schedule must have a sender!']
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
    approved: {
      type: Boolean,
      default: false
    },
    approvedBy: {
      type: String
    },
    approvedAt: {
      type: String
    },
    meetingDate: {
      type: String
    },
    meetingTime: {
      type: String
    },
    meetingStarted: {
      type: Boolean,
      default: false
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

// scheduleSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'sender'
//   });
//   next();
// });

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
