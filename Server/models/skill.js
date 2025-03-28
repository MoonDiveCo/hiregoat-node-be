// TODO: need to be review

import mongoose, { Schema } from "mongoose";

const skillSchema = new Schema(
  {
    name: {
    type: String,
    required: true
    },

  category: {
    type: String,
    enum: [
      'technical', 
      'soft', 
      'language', 
      'tool', 
      'framework', 
  ],
  },

},
  {
    timestamps: true,
  }
);

const Skill = mongoose.model("skill", skillSchema);

export default Skill;
