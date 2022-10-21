var jwt = require('jsonwebtoken');
const sendEmail = require('./sendEmail');
const bcrypt = require('bcryptjs');
var db = require('../../../config/config');
require('dotenv').config;

const Models = require('../../../models');
const { User } = Models;

class AuthController {
  async auth(request, response, next) {
    try {
      ///check if email already exists
      await User.findOne({
        where: {
          email: request.body.email,
        },
      }).then((user) => {
        console.log(user);
      });

      // db.query(
      //   `select email from users where email ='${request.body.email}'`,
      //   async function (err, result) {
      //     if (result.length > 0) {
      //       return response.send({
      //         status: 201,
      //         message: 'Email already exists',
      //       });
      //     } else {
      //       var token = jwt.sign(request.body.email, request.body.password);
      //       var hashedPassword = bcrypt.hashSync(request.body.password);
      //       db.query(
      //         `INSERT INTO users (email, password, auth_token) VALUES ('${request.body.email}','${hashedPassword}','${token}')`,
      //         function (err, result) {
      //           console.log(err);
      //         }
      //       );

      //       var verificationLink = `${process.env.web_url}/verify/${token}`;

      //       var message =
      //         'Click on this link to verify your email: ' +
      //         `<a  href="${verificationLink}"> Click here </a>`;
      //       await sendEmail(request.body.email, 'Verify Email', message);
      //       return response.send({
      //         status: 200,
      //         message: 'Email sent',
      //       });
      //     }
      //   }
      // );
    } catch (error) {
      next(error);
    }
    return undefined;
  }

  async login(request, response, next) {
    try {
      var email = request.body.email;
      var password = request.body.password;

      db.query(
        `select password, verified from users where email = '${email}'`,
        function (err, result) {
          if (result && result.length > 0) {
            if (!result[0].verified) {
              return response.send({
                status: 400,
                message: 'Email is not verified',
              });
            }

            let dbPassword = result[0].password;
            dbPassword = dbPassword.replace(/^\$2y(.+)$/i, '$2a$1');
            if (bcrypt.compareSync(password, dbPassword)) {
              // log user in
              return response.send({
                status: 200,
                message: 'login done',
              });
            } else {
              // password does not match
              return response.send({
                status: 400,
                message: 'email or password does not match',
              });
            }
          } else {
            return response.send({
              status: 400,
              message: 'email or passord does not match',
            });
          }
        }
      );
    } catch (error) {
      next(error);
    }
    return undefined;
  }

  async verify(request, response, next) {
    try {
      var token = request.params.token;

      // check if token exists in DB
      // if yes then verify that user and return success message
      // else return error message
      db.query(
        `select verified from users where auth_token ='${token}'`,
        function (err, result) {
          if (result.length > 0) {
            if (result[0].verified === 0) {
              db.query(
                `UPDATE users SET verified = 1 WHERE auth_token ='${token}'`,
                function (err, result) {
                  console.log(result.affectedRows);

                  return response.send({
                    status: 200,
                    message: 'Email verified',
                  });
                }
              );
            } else {
              return response.send({
                status: 202,
                message: 'Email already verified',
              });
            }
          } else {
            return response.send({
              status: 400,
              message: 'Email not verified',
            });
          }
        }
      );
    } catch (e) {
      next(e);
    }
    return undefined;
  }
}

module.exports = new AuthController();
