import EmployerSchema from '../../../models/user'

/**
 * User service functions.
 * @namespace
 * @global
 */


const employerServices = {
  createUser: async (insertObj) => {
    return await EmployerSchema.create(insertObj);
  },
  findUser: async (query) => {
    return await EmployerSchema.findOne(query);
  },
  findUsers: async (query) => {
    return await EmployerSchema.find(query);
  },
  updateUserById: async (query, updateObj) => {
    return await EmployerSchema.findByIdAndUpdate(query, updateObj, { new: true });
  }
}

module.exports = { employerServices };
