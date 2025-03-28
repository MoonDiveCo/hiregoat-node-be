import config from 'config';
import jwt from 'jsonwebtoken';
import AWS from 'aws-sdk';
import nodemailer from 'nodemailer';
import path from 'path'


AWS.config.update({
  accessKeyId: config.get('AWS.accessKeyId'),
  secretAccessKey: config.get('AWS.secretAccessKey'),
  region: config.get('AWS.region'),
})

var s3 = new AWS.S3();

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

  sendRegisterMail(email) {
    console.log('Sending', email);
    return new Promise((resolve, reject) => {
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.emailAuth.user,
          pass: config.emailAuth.pass,
        },
      });
      var mailOption = {
        from: '<moondiveco@gmail.com>',
        to: email,
        subject: 'Welcome to MoonDive!',
        html: `
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
  
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
              <tr>
                  <td style="padding: 20px 0; text-align: center; background-color: #018191;">
                      <h1 style="color: #fff;">Welcome to MoonDive!</h1>
                  </td>
              </tr>
              <tr>
                  <td style="padding: 20px; background-color: #fff;">
                      <h2>Hi there!</h2>
                      <p>Thanks for signing up with MoonDive.</p>
  
                      <p>To understand your requirements and serve you better, we have shared your registration information with one of our authorized MoonDive Partners in your region, Interloop Pvt Ltd. This partner may contact you to assist you with implementing MoonDive solutions for your business. Our partners are qualified to provide business scoping, implementation, training, sales, and support services across MoonDive products. Kindly note that MoonDive does not have a say in their service fees.</p>
  
                      <p>You can opt to work with the suggested partner, or choose another MoonDive partner. Please find all our authorized Partners listed <a href="https://www.moondive.co/" target="_blank">here</a>. If you do not want to hear from the suggested partner, you can opt-out by replying to this email. Should you wish not to work with a partner, you can work directly with MoonDive by letting us know the same.</p>
                  </td>
              </tr>
              <tr>
                  <td style="padding: 20px; background-color: #018191; text-align: center;">
                      <p style="color: #fff;">&copy; 2024 MoonDive</p>
                  </td>
              </tr>
          </table>    
      </body>`,
      };

      transporter.sendMail(mailOption, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  },
};
