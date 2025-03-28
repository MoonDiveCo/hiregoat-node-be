import config from 'config';
import jwt from 'jsonwebtoken';
import userModel from '../models/user';
import commonFunction from '../helper/util';
import responseMessage from '../../config/responseMessage';

let commonPayload = null;

module.exports = {
  async verifyToken(req, res, next) {
    try {
      commonPayload = null;
      const token = req.headers.token || req.cookies.token;
      if (!token) {
        return res.status(400).json({
          responseCode: 400,
          responseMessage: 'No token provided.',
        });
      }

      commonPayload = jwt.decode(token);

      try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        commonPayload = decoded;

        const user = await userModel.findOne({ _id: commonPayload._id }).exec();

        if (!user) {
          return res.status(404).json({
            responseCode: 404,
            responseMessage: responseMessage.USER_NOT_FOUND,
          });
        }

        if (user.status === 'BLOCKED') {
          return res.status(403).json({
            responseCode: 403,
            responseMessage: 'You have been blocked by admin.',
          });
        }

        if (user.status === 'DELETE') {
          return res.status(401).json({
            responseCode: 401,
            responseMessage: 'Your account has been deleted by admin.',
          });
        }

        req.userId = commonPayload._id;
        req.userDetails = commonPayload;
        return next();
      } catch (verificationError) {
        if (commonPayload) {
          try {
            const { iat, exp, ...cleanNewPayload } = commonPayload;
            commonPayload = cleanNewPayload;

            const newToken = await commonFunction.getRefreshToken(
              commonPayload
            );
            res.cookie('token', newToken, {
              httpOnly: true,
              maxAge: 24 * 60 * 60 * 1000,
              secure: process.env.NODE_ENV === 'production',
              sameSite:
                process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            });
            req.headers.token = newToken;
            const decodedNewToken = jwt.verify(
              newToken,
              config.get('jwtSecret')
            );
            commonPayload = decodedNewToken;

            req.userId = commonPayload._id;
            req.userDetails = commonPayload;
            return next();
          } catch (refreshError) {
            return res.status(401).json({
              responseCode: 401,
              responseMessage: 'Refresh token expired. Please log in again.',
            });
          }
        }
        return res.status(401).json({
          responseCode: 401,
          responseMessage: 'Invalid or expired token. Please log in again.',
        });
      }
    } catch (error) {
      return next(error);
    }
  },
};
