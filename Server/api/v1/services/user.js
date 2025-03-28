import UserSchema from '../../../models/user'

/**
 * User service functions.
 * @namespace
 * @global
 */


const userServices = {
  createUser: async (insertObj) => {
    return await UserSchema.create(insertObj);
  },
  findUser: async (query) => {
    return await UserSchema.findOne(query);
  },
  findUsers: async (query) => {
    return await UserSchema.find(query);
  },
  updateUserById: async (query, updateObj) => {
    return await UserSchema.findByIdAndUpdate(query, updateObj, { new: true });
  }
}

module.exports = { userServices };
