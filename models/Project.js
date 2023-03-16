'use strict'

const mongoose = require('mongoose')

const ProjectSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    default: Date.now(),
  },
  endDate: {
    type: Date,
  },
  progress: {
    type: Number,
    default: 0,
  },
})

module.exports = mongoose.model('Project', ProjectSchema)
