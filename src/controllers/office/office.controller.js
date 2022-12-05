const sequelize = require('sequelize');
const moment = require('moment');
const Models = require('../../../models');
const { Office, User, GroupMember, Group } = Models;
const { Op } = sequelize;

class OfficeController {
  /**
   * adding office in database with given name and location
   *
   * @param {Object} req {
   * body: {
   *  name: String,
   *  location: String
   * }
   * }
   * @param {Object} res 200 for success.
   * @returns {Object}
   */

  async addOffice(req, res, next) {
    const officeData = req.body;

    try {
      await Office.create(officeData);
      return res.send({
        status: 200,
        message: 'Success',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * getting all offices list from database
   *
   *
   * @param {Object} res 200 for success. 400 for failing
   * @returns {Object}
   */

  async getOfficesList(req, res, next) {
    try {
      await Office.findAll({
        attributes: ['id', 'name', 'location'],
      }).then(async (result) => {
        if (result) {
          return res.send({
            status: 200,
            message: 'Offices Fetched Successfully',
            data: result,
          });
        } else {
          return res.send({
            status: 400,
            message: 'Failed to fetch offices',
          });
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Creates group having group-members eating at office with given Time
   *
   * @param {Object} req {
   * body: {
   *  time: String
   * },
   * headers: {
   *  authorization: authToken
   * }
   * }
   * @param {Object} res 200 for success.
   * @returns {Object}
   */

  async eatAtOffice(req, res, next) {
    const authToken = req.headers.authorization;
    let time = req.body.time;

    try {
      let user = await User.findOne({
        attributes: ['id', 'officeId'],
        where: {
          authToken,
        },
      });

      if (user) {
        await Group.findOne({
          attributes: ['id'],
          where: {
            officeId: user.officeId,

            time: {
              [Op.eq]: new moment.utc(req.body.time),
            },
          },
        }).then(async (result) => {
          if (result) {
            await GroupMember.destroy({
              where: {
                userId: user.id,
              },
            });
            await GroupMember.create({
              userId: user.id,
              groupId: result.id,
            });
          } else {
            await Group.create({
              time: new moment.utc(req.body.time),
              officeId: user.officeId,
              restaurantId: '0',
            }).then(async (result) => {
              if (result) {
                await GroupMember.destroy({
                  where: {
                    userId: user.id,
                  },
                });
                await GroupMember.create({
                  userId: user.id,
                  groupId: result.id,
                });
              }
            });
          }
        });
      }
      res.send({
        message: 'Success',
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = new OfficeController();
