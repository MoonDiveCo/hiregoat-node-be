// src/models/Chat.js

import mongoose, { Schema } from 'mongoose';

const MessageSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    
    content: {
      type: String,
      required: true
    },
  
    isSystemMessage: {
      type: Boolean,
      default: false
    }
  }, {
    timestamps: true
  });


const Message = mongoose.model('message', MessageSchema);

export default Message;
