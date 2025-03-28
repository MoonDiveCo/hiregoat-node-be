import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true
        },

        lastName: {
            type: String
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        userRole: {
            type: String,
            enum: ['candidate', 'employer', 'superAdmin'],
            required: true
        },

        dateOfBirth: {
            type: Date
        },

        gender: {
            type: String,
        },

        password: {
            type: String,
            minlength: 8
        },

        profileCompleted: {
            type: Boolean,
            default: false
        },

        profileCompletionPercentage: {
            type: Number,
            default: 0
        },

        profileImage: {
            type: String,
            default: ''
        },

        mobileNumber: {
            type: String
        },

        isMobileVerified: {
            type: Boolean,
            default: false
        },

        isAccountVerified: {
            type: Boolean,
            default: false
        },

        isNumberPublic: {
            type: Boolean,
            default: false
        },

        emailVerified: {
            type: Boolean,
            default: false
        },

        address: {
            city: { type: String },
            state: { type: String },
            country: { type: String },
        },

        bio: {
            type: String
        },

        candidateJobLocation: {
            type: String
        },

        employmentStatus: {
            type: String,
            enum: ['employed', 'unemployed', 'freelancer', 'student']
        },

        jobSeekingStatus: {
            type: String,
            enum: ['actively looking', 'open to offers', 'not looking', 'casually browsing']
        },

        careerObjective: {
            type: String
        },

        skills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Skill'
            }
        ],

        personalityTraits: {
            type: Object,
            default: {}
        },

        preferences: {
            jobTypes: [String],
            locations: [String],
            industries: [String],
            salaryRange: { min: Number, max: Number },
            remotePreference: {
                type: String,
                enum: ['remote', 'hybrid', 'on-site', 'flexible']
            }
        },

        experience: [{
            title: String,
            company: String,
            location: String,
            from: Date,
            to: Date,
            current: Boolean,
            description: String
        }],

        education: [{
            institution: String,
            degree: String,
            fieldOfStudy: String,
            from: Date,
            to: Date,
            current: Boolean,
            description: String
        }],

        certifications: [{
            name: String,
            organization: String,
            issueDate: Date,
            expiryDate: Date,
            credentialId: String,
            credentialUrl: String
        }],

        projects: [{
            title: String,
            description: String,
            technologies: [String],
            link: String,
            startDate: Date,
            endDate: Date,
            ongoing: Boolean
        }],

        languages: [{ name: String, proficiency: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'native'] } }],

        socialLinks: {
            linkedIn: String,
            github: String,
            portfolio: String,
        },

        savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],

        appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],

        shortlistedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],

        availability: {
            availableFrom: Date,
            preferredTimes: [String] // e.g., ['morning', 'afternoon', 'evening']
        },

        employerCompanyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },

        employerCompanyRole: {
            type: String,
            enum: [
                'Owner',
                'Founder',
                'CEO',
                'HR Manager',
                'HR Executive',
                'Recruiter',
                'Talent Acquisition Specialist',
                'Hiring Manager',
                'COO',
                'CTO',
                'CFO',
            ],
            default: 'Owner',
        },

        otp: {
            value: {
                type: String,
            },

            expiryDate: {
                type: String,
            },
        },

        resetPassword: {
            resetOtp: String,
            resetOtpExpireTime: String
        },

        active: { type: Boolean, default: true },

        lastActive: { type: Date, default: Date.now },

        archivedAt: {
            type: Date,
        },

    },
    { timestamps: true }
);


const User = mongoose.model('user', userSchema);

export default User;
