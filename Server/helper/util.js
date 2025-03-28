import config from 'config';
import jwt from 'jsonwebtoken';
import path from 'path'

module.exports = {
  getOTP() {
    var otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
  },
  verifyToken: async (payload) => {
    var tokenData = await jwt.verify(payload, config.get('jwtSecret'));
    if (tokenData) {
      return tokenData._id;
    }
  },

  uploadS3Image: async (imageBuffer, originalName) => {
    try {
      const timestamp = Date.now()
      const fileExtension = path.extname(originalName)
      const imageFileName = `image_${timestamp}${fileExtension}`;
      const uploadParams = {
        Bucket: 'hrms-bucket-s3',
        Key: imageFileName,
        Body: imageBuffer,
        ACL: 'public-read',
      };
      const uploadResult = await s3.upload(uploadParams).promise();
      return uploadResult.Location;

    } catch (error) {
      console.log(error)
    }
  },

  async removeImage(key) {
    const params = {
      Bucket: "hrms-bucket-s3",
      Key: key,
    };
    const uploadResult = await s3.deleteObject(params).promise();
    if (!uploadResult) {
      throw error;
    } else {
      console.log(uploadResult);
    }
  },

  getToken: async (payload) => {
    var token = jwt.sign(payload, config.get('jwtSecret'), {
      expiresIn: '24h',
    });
    return token;
  },
  getRefreshToken: async (payload) => {
    var token = jwt.sign(payload, config.get('jwtSecret'), {
      expiresIn: '24d',
    });
    return token;
  },
};
