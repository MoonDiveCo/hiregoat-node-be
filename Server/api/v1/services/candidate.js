import CandidateSchema from '../../../models/user'

/**
 * User service functions.
 * @namespace
 * @global
 */


const candidateServices = {
  createUser: async (insertObj) => {
    return await CandidateSchema.create(insertObj);
  },
  findUser: async (query) => {
    return await CandidateSchema.findOne(query);
  },
  findUsers: async (query) => {
    return await CandidateSchema.find(query);
  },
  updateUserById: async (query, updateObj) => {
    return await CandidateSchema.findByIdAndUpdate(query, updateObj, { new: true });
  }
}

module.exports = { candidateServices };
