import mongoose, { Schema } from 'mongoose';
const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
    },

    logo: {
      type: String,
      default: ''
    },

    coverImage: {
      type: String,
      default: ''
    },

    website: {
      type: String
    },

    industry: {
      type: String,
 enum: [
    'Accounting',
    'Advertising & Marketing',
    'Aerospace & Defense',
    'Agriculture',
    'Automotive',
    'Banking & Finance',
    'Biotechnology',
    'Chemical',
    'Construction',
    'Consumer Goods',
    'Education',
    'Energy & Utilities',
    'Engineering',
    'Entertainment & Media',
    'Environmental Services',
    'Fashion & Apparel',
    'Food & Beverage',
    'Government & Public Administration',
    'Healthcare & Pharmaceuticals',
    'Hospitality',
    'Human Resources',
    'Information Technology & Services',
    'Insurance',
    'Legal',
    'Logistics & Supply Chain',
    'Manufacturing',
    'Mining & Metals',
    'Nonprofit & NGOs',
    'Oil & Gas',
    'Real Estate',
    'Retail',
    'Sports & Recreation',
    'Telecommunications',
    'Transportation',
    'Travel & Tourism',
    'Venture Capital & Private Equity',
    'Wholesale & Distribution',
    'Other'
  ]    },

    companyType: {
      type: String,
      enum: ['Public', 'Private', 'Nonprofit', 'Government'],
      required: true
    },
    jobPostings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
    companyVerificationStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected'],
      default: 'Pending',
    },


    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001+'],
      required: true
    },

    headquarters: {
      type: String
    },

    founded: {
      type: Date
    },

    culture: {
      description: String,
      values: [String],
      benefits: [String],
      workEnvironment: String
    },

    locations: [{
      street: String,
      city: String,
      state: String,
      country: String,
      isPrimary: Boolean
    }],

    social: {
      linkedin: {
        type: String,
      },
      XLink: {
        type: String,
      },
      facebook: {
        type: String,
      },
      instagram: {
        type: String,
      }
    },

    admins: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],

    subscription: {
      plan: {
        type: String,
        enum: ['free', 'basic', 'premium', 'enterprise'],
        default: 'free'
      },
      startDate: Date,
      endDate: Date,
      status: {
        type: String,
        enum: ['active', 'canceled', 'expired'],
        default: 'active'
      }
    },
    fundingRounds: [{
      round: {
        type: String,
        enum: ['Seed', 'Series A', 'Series B', 'Series C', 'IPO']
      },
      amount: Number,
      date: Date
    }],
   },
  {
    timestamps: true,
  }
);
const Company = mongoose.model('company', companySchema);
export default Company;
