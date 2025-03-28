// src/models/Chat.js

import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate';

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

MessageSchema.plugin(mongoosePaginate);
MessageSchema.plugin(mongooseAggregatePaginate);

const Message = mongoose.model('message', MessageSchema);

export default Message;
