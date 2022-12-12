const Models = require('../../../models');
const { User } = Models;

class UserController {
  /**
   * Update user with given office id
   *
   * @param {Object} req {
   * body: {
   *  officeId: Integer
   * },
   * headers: {
   *  authorization: authToken
   * }
   * }
   * @param {Object} res 200 for success. 400 for failing
   * @returns {Object}
   */

  async updateUser(req, res, next) {
    let officeId = req.body.officeId || 1;
    const authToken = req.headers.authorization;
    try {
      await User.update(
        { officeId },
        {
          where: {
            authToken,
          },
        }
      ).then((resp) => {
        if (!resp[0]) {
          return res.status(400).send({
            message: 'User not found',
          });
        }
        return res.send({
          status: 200,
          message: 'User updated successfully',
        });
      });
    } catch (error) {
      next(error);
    }
    return undefined;
  }
}

module.exports = new UserController();
