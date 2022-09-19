const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Schedule must belong to someone']
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
    },
    assigned: {
      type: Boolean,
      default: false
    },
    assignee: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

scheduleSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'sender',
    select: '-_v'
  });
  next();
});
scheduleSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'assignee',
    select: 'email firstName lastName'
  });
  next();
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
