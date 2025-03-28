import mongoose, { Schema } from 'mongoose';

const jobSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
          },
          description: {
            type: String,
          },
          company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true
          },
          location: {
            type: String,
            required: true,
          },
          workType: {
            type: String,
            enum: ['on-site', 'remote', 'hybrid', 'flexible'],
            default: 'on-site'
          },
          employmentType: {
            type: String,
            enum: ['full-time','contract', 'internship', 'training'],
            required: true
          },
          experienceLevel: {
            type: String,
            enum: ['entry', 'mid-senior', 'senior', 'executive', 'any'],
            default: 'any'
          },
          salary: {
            min: {
              type: Number
            },
            max: {
              type: Number
            },
            currency: {
              type: String,
              default: 'USD'
            }
          },
          requiredSkills: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill'
          }],
          niceToHaveSkills: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill'
          }],
          industry: {
            type: String
          },
          benefits: [{
            type: String
          }],
          culturalValues: [{
            type: String
          }],
          keywords: [{
            type: String
          }],
          status: {
            type: String,
            enum: ['draft', 'active', 'closed', 'expired'],
            default: 'draft'
          },
          applicationDeadline: {
            type: Date
          },
          applicationCount: {
            type: Number,
            default: 0
          },
          viewCount: {
            type: Number,
            default: 0
          },
          matchParams: {
            personalityTraits: {
              type: Object,
              default: {}
            },
            culturalFit: [{
              type: String
            }],
            ethicalValues: [{
              type: String
            }]
          },
          aiGenerated: {
            type: Boolean,
            default: false
          },
          aiGeneratedContent: {
            type: Object,
            default: {}
          }},
    {
        timestamps: true,
    }
);

const User = mongoose.model('job', jobSchema);

export default User;
