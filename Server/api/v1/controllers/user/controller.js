import Joi from 'joi';
import bcrypt from 'bcrypt';
import { userServices } from '../../services/user';
import response from '../../../../../config/response';
import responseMessage from '../../../../../config/responseMessage';
const { createUser, findUser, updateUserById } = userServices;
import commonFunction from '../../../../helper/util';

export class userController {

  /**
   * @swagger
   * /user/register:
   *   post:
   *     tags:
   *       - USER
   *     description: userRegister
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: email
   *         description: email
   *         in: formData
   *         required: true
   *       - name: mobileNumber
   *         description: mobileNumber
   *         in: formData
   *         required: true
   *       - name: password
   *         description: password
   *         in: formData
   *         required: true
   *     responses:
   *       200:
   *         description: user created successfully
   *       409:
   *         description: This email already exists ./ This mobile number already exists.
   *       501:
   *         description: Something went wrong.
   *       500:
   *         description: Internal server error.
   */
  async registerUser(req, res, next) {
    const userValidationSchema = Joi.object({
      email: Joi.string().email().required(),
      mobileNumber: Joi.string().required(),
      password: Joi.string().required(),
      employeeId: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string()
    });

    try {
      const validatedBody = await userValidationSchema.validateAsync(req.body);

      const existingUser = await findUser({ email: validatedBody.email });

      if (existingUser) {
        return res.json(response.conflict({}, responseMessage.EMAIL_EXIST));
      } else {
        const salt = await bcrypt.genSalt(12);
        validatedBody.password = await bcrypt.hash(
          validatedBody.password,
          salt
        );
        // validatedBody.userRole = ACCOUNT_ADMIN;

        const result = await createUser(validatedBody);
        const token = await commonFunction.getToken({
          _id: result._id,
          
          email: result.email,
          mobileNumber: result.mobileNumber,
          userRole: result.userRole,
        });
        res.cookie('token', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
        // await commonFunction.sendRegisterMail(validatedBody.email);
        return res.json(response.success({token,userResult: result}, responseMessage.USER_CREATED));
      }
    } catch (error) {
      return next(error);
    }
  }
  /**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - USER
 *     description: userLogin
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email
 *         in: formData
 *         required: true
 *       - name: password
 *         description: password
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: User Login successfully
 *       409:
 *         description: User Not Found.
 *       501:
 *         description: Something went wrong.
 *       500:
 *         description: Internal server error.
 */
  async loginUser(req, res, next) {
    const validationSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    try {
      const validatedBody = await validationSchema.validateAsync(req.body);
      const userResult = await findUser({ email: validatedBody.email });
      if (!userResult) {
        return res.json(response.notFound({}, responseMessage.USER_NOT_FOUND));
      }
      const isMatch = await bcrypt.compare(
        validatedBody.password,
        userResult.password
      );

      if (!isMatch) {
        return res.json(
          response.invalid({}, responseMessage.INCORRECT_PASSWORD)
        );
      }

      const token = await commonFunction.getToken({
        _id: userResult._id,
        email: userResult.email,
        mobileNumber: userResult.mobileNumber,
        userRole: userResult.userRole,
      });
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        secure: process.env.NODE_ENV === 'production', // Only for production
        sameSite: 'strict', // or lax depending on your use case
      });
      return res.json(response.success({token,userResult: userResult}, responseMessage.LOGIN));
    } catch (error) {
      next(error);
    }
  }
  /**
   * @swagger
   * /user/get-profile:
   *   get:
   *     tags:
   *       - USER
   *     description: getProfile
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: User token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Profile details found successfully.
   *       404:
   *         description: User not found.
   *       501:
   *         description: Something went wrong.
   *       500:
   *         description: Internal server error.
   */
  async getProfile(req, res, next) {
    try {
      const userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        return res.json(response.notFound({}, responseMessage.USER_NOT_FOUND));
      }
      const userResultNew = {
        _id: userResult._id,
        email: userResult.email,
        mobileNumber: userResult.mobileNumber,
        userRole: userResult.userRole,
      };

      return res.json(
        response.succsss(
          { userResult: userResultNew },
          responseMessage.USER_FETCHED_SUCCESS
        )
      );
    } catch (error) {
      return next(error);
    }
  }
  async editProfile(req, res, next) {
    const validationSchema = Joi.object({
      firstName: Joi.string().allow('').optional(),
      lastName: Joi.string().allow('').optional(),
      dateOfBirth: Joi.string().allow('').optional(),
      email: Joi.string().allow('').optional(),
      imageUrl: Joi.string().allow('').optional(),
      mobileNumber: Joi.string().allow().optional(),
      alternateMobileNumber: Joi.string().allow().optional(),
      countryCode: Joi.string().allow('').optional(),
      gender: Joi.string().allow('').optional(),
      about: Joi.string().allow('').optional(),
      maritalStatus: Joi.string().allow('').optional(),
    });

    try {
      const validatedBody = await validationSchema.validateAsync(req.body);
      const userResult = await findUser({ _id: req.userId });

      if (!userResult) {
        return res.json(response.notFound({}, responseMessage.USER_NOT_FOUND));
      }
      const result = await updateUserById({ _id: req.userId }, validatedBody);

      if (!result) {
        return res.json(response.notFound({}, responseMessage.USER_NOT_FOUND));
      }
      return res.json(response.success(result, responseMessage.USER_UPDATED));
    } catch (error) {
      return next(error);
    }
  }


  async resetPassword(req, res, next) {
    const validationSchema = Joi.object({
      email: Joi.string().email().required(),
      currentPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
    });
    try {
      const validatedBody = await validationSchema.validateAsync(req.body);
      const existingUser = await findUser({ email: validatedBody.email });
      if (!existingUser) {
        return res.json(response.notFound({}, responseMessage.USER_NOT_FOUND));
      }
      const isMatch = await bcrypt.compare(
        validatedBody.currentPassword,
        existingUser.password
      );
      if (!isMatch) {
        return res.json(
          response.conflict({}, responseMessage.PASSWORD_NOT_EXIST)
        );
      }

      if (validatedBody.currentPassword === validatedBody.newPassword) {
        return res.json(
          response.conflict({}, responseMessage.PASSWORD_NOT_UPDATE)
        );
      }

      const salt = await bcrypt.genSalt(12);
      const hashedNewPassword = await bcrypt.hash(
        validatedBody.newPassword,
        salt
      );

      const updatedUser = await updateUserById(existingUser._id, {
        password: hashedNewPassword,
      });
      return res.json(response.succsss({}, responseMessage.PASSWORD_UPDATE));
    } catch (error) {
      next(error);
    }
  }
  async forgotPassword(req, res, next) {
    const validationSchema = Joi.object({
      email: Joi.string(),
      newPassword: Joi.string().min(6).required(),
      confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
    });
    try {
      const validatedBody = await validationSchema.validateAsync(req.body);

      const { newPassword } = validatedBody;
      const user = await findUser({ email: validatedBody.email });
      if (!user) {
        return res.json(response.notFound({}, responseMessage.USER_NOT_FOUND));
      }
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
      return res.json(response.success({}, responseMessage.PASSWORD_UPDATE));
    } catch (error) {
      next(error);
    }
  }
}

export default new userController();
