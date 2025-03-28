import Joi from 'joi';
import bcrypt from 'bcrypt';
import { employerServices } from '../../services/employer';
import User from '../../../../models/user';

const {
  findUser
} = employerServices;


export class employerController {
 
}

export default new employerController();
