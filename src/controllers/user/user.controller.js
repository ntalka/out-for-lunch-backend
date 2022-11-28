const Models = require('../../../models');
const { User } = Models;

class UserController {
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
