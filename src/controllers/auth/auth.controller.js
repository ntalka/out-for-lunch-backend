var jwt = require('jsonwebtoken');
const sendEmail = require("./sendEmail");
const bcrypt = require('bcryptjs');

var db = require("../../../util/database");
require('dotenv').config;

class AuthController {
    async auth(request, response, next) {
        try {

            
            var token = jwt.sign(request.body.email, request.body.password);
            var hashedPassword= bcrypt.hashSync(request.body.password);
            db.query(`INSERT INTO users (email, password, auth_token) VALUES ('${request.body.email}','${hashedPassword}','${token}')`, function(err, result) {
                console.log(err);
                // connection.query(`INSERT INTO users (email,password,auth_token) VALUES (${request.body.email},${hashedPassword},${token})`)
            });
            


            var verificationLink = `${process.env.web_url}/verify/${token}`

            var message = 'Click on this link to verify your email: ' + `<a  href="${verificationLink}"> Click here </a>`
            await sendEmail(request.body.email, "Verify Email", message);
            return response.send({
                status: 200,
                message: "Email sent"
            })
        } catch (error) {
            next(error)
        }
        return undefined
        // response.sendFile(path.join(__dirname, 'index.html'));

    }


    async verify(request, response, next) {

        try {
            var token = request.params.token;

            // check if token exists in DB
            // if yes then verify that user and return success message
            // else return error message


            return response.send({
                status: 200,
                message: "Email verified"
            })
        } catch (e) {
            next(e);
        }
        return undefined

        // response.sendFile(path.join(__dirname, 'index.html'));

    }

}

module.exports = new AuthController();