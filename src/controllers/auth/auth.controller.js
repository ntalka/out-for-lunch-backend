var jwt = require('jsonwebtoken');
const sendEmail = require('./sendEmail');
const bcrypt = require('bcryptjs');
var db = require('../../../config/config');
require('dotenv').config;

const Models = require('../../../models');
const {
    User
} = Models;

class AuthController {
    async auth(request, response, next) {
        try {
            const {
                email,
                password
            } = request.body;

            await User.findOne({
                // attributes: ['email'],
                where: {
                    email: request.body.email,
                },
            }).then(async (user) => {
                ///check if email already exists
                if (!user) {
                    var token = jwt.sign(email, password);
                    var hashedPassword = bcrypt.hashSync(password);
                    const name = email.split('@')[0];
                    const firstName = name.split('.')[0];
                    const lastName = name.split('.')[1];
                    User.create({
                        email,
                        password: hashedPassword,
                        authToken: token,
                        name: `${firstName} ${lastName}`,
                        officeId: 1,
                    });

                    var verificationLink = `${process.env.web_url}/verify/${token}`;

                    var message =
                        'Click on this link to verify your email: ' +
                        `<a  href="${verificationLink}"> Click here </a>`;
                    await sendEmail(request.body.email, 'Verify Email', message);
                    return response.status(200).send({
                        message: 'Email sent',
                        authToken: token,
                    });
                } else {
                    return response.status(400).send({
                        message: 'Email already exists',
                    });
                }
            });
        } catch (error) {
            next(error);
        }
        return undefined;
    }

    async login(request, response, next) {
        try {
            var email = request.body.email;
            var password = request.body.password;

            /////////////////////////////////////
            await User.findOne({
                attributes: ['password', 'verified', 'authToken'],
                where: {
                    email: request.body.email,

                },
            }).then(async (result) => {

                if (result) {
                    if (!result.verified) {
                        return response.send({
                            status: 400,
                            message: 'Email is not verified',
                        });
                    }

                    let dbPassword = result.password;
                    dbPassword = dbPassword.replace(/^\$2y(.+)$/i, '$2a$1');
                    if (bcrypt.compareSync(password, dbPassword)) {
                        // log user in
                        return response.send({
                            status: 200,
                            authToken: result.authToken,
                            message: 'login done',
                        });
                    } else {
                        // password does not match
                        return response.send({
                            status: 400,
                            message: 'password does not match',
                        });
                    }
                } else {
                    return response.send({
                        status: 400,
                        message: 'email or password does not match',
                    });
                }
            })

            /////////////////////////////////////////////////////////


            // db.query(
            //   `select password, verified from users where email = '${email}'`,
            //   function (err, result) {
            //     if (result && result.length > 0) {
            //       if (!result[0].verified) {
            //         return response.send({
            //           status: 400,
            //           message: 'Email is not verified',
            //         });
            //       }

            //       let dbPassword = result[0].password;
            //       dbPassword = dbPassword.replace(/^\$2y(.+)$/i, '$2a$1');
            //       if (bcrypt.compareSync(password, dbPassword)) {
            //         // log user in
            //         return response.send({
            //           status: 200,
            //           message: 'login done',
            //         });
            //       } else {
            //         // password does not match
            //         return response.send({
            //           status: 400,
            //           message: 'email or password does not match',
            //         });
            //       }
            //     } else {
            //       return response.send({
            //         status: 400,
            //         message: 'email or passord does not match',
            //       });
            //     }
            //   }
            // );
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


            await User.findOne({
                attributes: ['verified'],
                where: {
                    authToken: token,

                },
            }).then(async (result) => {

                if (result) {
                    // console.log(result);
                    if (!result.verified) {
                        User.update({
                            verified: true
                        }, {
                            where: {
                                authToken: token
                            }
                        }).then(() => {

                            return response.send({
                                status: 200,
                                authToken: token,
                                message: 'Email verified',
                            });

                        });
                        //////////////////////////////
                        // db.query(
                        //   `UPDATE users SET verified = 1 WHERE auth_token ='${token}'`,
                        //   function (err, result) {
                        //     console.log(result.affectedRows);

                        //     return response.send({
                        //       status: 200,
                        //       message: 'Email verified',
                        //     });
                        //   }
                        // );
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


            })

            ////////////////////////////////
            // db.query(
            //   `select verified from users where auth_token ='${token}'`,
            //   function (err, result) {
            //     if (result.length > 0) {
            //       if (result[0].verified === 0) {
            //         db.query(
            //           `UPDATE users SET verified = 1 WHERE auth_token ='${token}'`,
            //           function (err, result) {
            //             console.log(result.affectedRows);

            //             return response.send({
            //               status: 200,
            //               message: 'Email verified',
            //             });
            //           }
            //         );
            //       } else {
            //         return response.send({
            //           status: 202,
            //           message: 'Email already verified',
            //         });
            //       }
            //     } else {
            //       return response.send({
            //         status: 400,
            //         message: 'Email not verified',
            //       });
            //     }
            //   }
            // );
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new AuthController();