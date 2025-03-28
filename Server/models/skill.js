// TODO: need to be review

import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";

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

// Add pagination plugins
skillSchema.plugin(mongoosePaginate);
skillSchema.plugin(mongooseAggregatePaginate);

const Skill = mongoose.model("skill", skillSchema);

export default Skill;
