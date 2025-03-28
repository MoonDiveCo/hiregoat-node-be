import mongoose, { Schema } from 'mongoose';

const applicationSchema = new Schema(
  {
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
      },
      candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      companyIntended: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
      },
      coverletter: {
        type: String
      },
      resume: {
        type: String
      },
      matchScore: {
        type: Number,
        default: 0
      },
      matchDetails: {
        skillsMatch: {
          score: Number,
          matchedSkills: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill'
          }]
        },
        cultureMatch: {
          score: Number,
          details: Object
        },
        experienceMatch: {
          score: Number,
          details: Object
        },
        overallCompatibility: Number
      },
      status: {
        type: String,
        enum: ['applied', 'viewed', 'screening', 'interview', 'offer', 'hired', 'rejected'],
        default: 'applied'
      },
      statusHistory: [{
        status: {
          type: String,
          enum: ['applied', 'viewed', 'screening', 'interview', 'offer', 'hired', 'rejected']
        },
        timestamp: {
          type: Date,
          default: Date.now
        },
        note: String
      }],
      answers: [{
        question: String,
        answer: String
      }],
      notes: [{
        content: String,
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }],
      interviews: [{
        type: {
          type: String,
          enum: ['phone', 'video', 'in-person', 'technical', 'other']
        },
        scheduledAt: Date,
        duration: Number, // in minutes
        location: String,
        notes: String,
        status: {
          type: String,
          enum: ['scheduled', 'completed', 'canceled', 'rescheduled'],
          default: 'scheduled'
        }
      }],
      aiInsights: {
        strengths: [String],
        weaknesses: [String],
        recommendations: String,
        fitAnalysis: String
      },
      isShortlisted: {
        type: Boolean,
        default: false
      },
    
      lastCommunication: {
        date: Date,
        type: {
          type: String,
          enum: ['email', 'chat', 'phone', 'in-person', 'other']
        },
        summary: String
      },
      source: {
        type: String,
        enum: ['direct', 'referral', 'job-board', 'social', 'other']
      },
      applicationDate: {
        type: Date,
        default: Date.now
      },
      isActive: {
        type: Boolean,
        default: true
      }
  },
  { timestamps: true }
);

applicationSchema.plugin(mongoosePaginate);
applicationSchema.plugin(mongooseAggregatePaginate);

const Application = mongoose.model('application', applicationSchema);

export default Application;
