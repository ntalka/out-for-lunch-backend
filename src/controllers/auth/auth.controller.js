var jwt = require('jsonwebtoken');
const sendEmail = require("./sendEmail");
const bcrypt = require('bcryptjs');
var db = require("../../../util/database");
require('dotenv').config;

class AuthController {
    async auth(request, response, next) {
        try {

            ///check if email already exists 
            
            db.query(`select email from users where email ='${request.body.email}'`, async function(err, result){

                if(result.length > 0)
                {
                    return response.send({
                        status: 201,
                        message: "Email already exists"
                    })
                }

                else{
                    var token = jwt.sign(request.body.email, request.body.password);
                    var hashedPassword= bcrypt.hashSync(request.body.password);
                    db.query(`INSERT INTO users (email, password, auth_token) VALUES ('${request.body.email}','${hashedPassword}','${token}')`, function(err, result) {
                        console.log(err);
                    });

                    var verificationLink = `${process.env.web_url}/verify/${token}`

                    var message = 'Click on this link to verify your email: ' + `<a  href="${verificationLink}"> Click here </a>`
                    await sendEmail(request.body.email, "Verify Email", message);
                    return response.send({
                        status: 200,
                        message: "Email sent"
                    })
                }
            })
        } catch (error) {
            next(error)
        }
        return undefined
    }


    async verify(request, response, next) {

        try {
            var token = request.params.token;

            // check if token exists in DB
            // if yes then verify that user and return success message
            // else return error message
            db.query(`select verified from users where auth_token ='${token}'`, function(err, result) {

                if(result.length > 0) {
                    if(result[0].verified === 0) {

                        db.query(`UPDATE users SET verified = 1 WHERE auth_token ='${token}'`, function(err, result) {
                            console.log(result.affectedRows);
            
                                return response.send({
                                    status: 200,
                                    message: "Email verified"
                                })
                                
                            });
                        } else {
                            
                            return response.send({
                                status: 202,
                                message: "Email already verified"
                            })
                        }
                    } else {
                    return response.send({
                        status: 400,
                        message: "Email not verified"
                    })
                }
            })
        } catch (e) {
            next(e);
        }
        return undefined
    }

}

module.exports = new AuthController();