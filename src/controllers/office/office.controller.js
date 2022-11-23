const sequelize = require('sequelize');
const moment = require('moment');
const Models = require('../../../models');
const { Office, User, GroupMember, Group } = Models;
const { Op } = sequelize;

class OfficeController {
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
              [Op.eq]: new moment(time),
            },
          },
        }).then(async (result) => {
          if (result) {
            await GroupMember.create({
              userId: user.id,
              groupId: result.id,
            });
          } else {
            await Group.create({
              time: new moment(req.body.time),
              officeId: user.officeId,
              restaurantId: '0',
            }).then(async (result) => {
              if (result) {
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
