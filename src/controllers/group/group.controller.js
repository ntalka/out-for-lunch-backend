const Models = require('../../../models');
const moment = require('moment');
const sequelize = require('sequelize');
const Sequelize = require('../../../config/config');
const { Op, QueryTypes } = sequelize;
const { Group, GroupMember, User, Restaurant } = Models;

class GroupController {
  createGroup(request, response, next) {
    try {
      Group.create({
        time: new moment(request.body.time),
        officeId: request.body.officeId,
        restaurantId: request.body.restaurantId,
      }).then(async (group) => {
        if (group) {
          await User.findOne({
            attributes: ['id'],
            where: {
              authToken: request.body.authToken,
            },
          }).then(async (user) => {
            if (user) {
              GroupMember.create({
                userId: user.id,
                groupId: group.id,
              });
              response.send({
                status: 200,
                message: 'Success',
              });
            } else {
              console.log('not creating group members');
            }
          });
        } else {
          console.log('not');
        }
      });
    } catch (error) {
      next(error);
    }
    return undefined;
  }

  async createRandomGroup(request, response, next) {
    try {
      const nearByRestaurants = await Sequelize.query(
        `SELECT id FROM restaurants WHERE JSON_CONTAINS(nearby_office, \'[${request.body.nearByOffice}]\')`,
        {
          type: QueryTypes.SELECT,
        }
      ).then((resp) => {
        if (resp) {
          return resp.map((rest) => rest.id);
        } else return [];
      });

      response.send({
        status: 200,
        message: 'Success',
        data: nearByRestaurants,
      });
    } catch (error) {
      next(error);
    }
    return undefined;
  }

  async getGroupList(request, response, next) {
    await User.findOne({
      attributes: ['id', 'officeId', 'authToken'],
      where: {
        authToken: request.body.authToken,
      },
    })
      .then(async (user) => {
        if (user) {
          Group.findAll({
            attributes: ['id', 'officeId', 'restaurantId'],
            where: {
              officeId: user.officeId,
              time: {
                [Op.gte]: new Date(),
              },
            },
            include: [
              {
                model: GroupMember,
                as: 'groupMember',
                attributes: ['userId'],
                include: [
                  {
                    model: User,
                    as: 'user',
                    attributes: ['name'],
                  },
                ],
              },
              {
                model: Restaurant,
                as: 'restaurant',
                attributes: ['name'],
              },
            ],
          }).then((result) => {
            response.send({
              status: 200,
              message: 'Success',
              data: result,
            });
          });
        } else {
          response.send({
            status: 400,
            message: 'Could not get user',
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async joinRandomGroup(request, response, next) {
    try {
      let { userId, officeId } = await User.findOne({
        attributes: ['id', 'officeId'],
        where: {
          authToken: request.body.authToken,
        },
      })
        .then(async (user) => {
          if (user) {
            return { userId: user.id, officeId: user.officeId };
          } else return null;
        })
        .catch((error) => {
          console.log(error);
        });

      const groupIds = await Group.findAll({
        // attributes: ['id', 'officeId', 'restaurantId'],
        attributes: ['id'],
        where: {
          officeId: officeId,
          time: { [Op.gte]: new Date() },
        },
      })
        .then((result) => {
          if (result) {
            return result.map((res) => res.id);
          } else return [];
        })
        .catch((error) => {
          console.log(error);
        });

      if (!groupIds.length) {
        response.status(400).send({
          message: 'No group to join',
        });
      }

      let min = 0;
      let max = groupIds.length;

      let random = 1;
      while (random >= 0) {
        random = Math.floor(Math.random() * (max - min) + min);
        console.log(groupIds);
        console.log(random);
        let groupId = groupIds[random];
        console.log('group id: ', groupId);
        const groupMember = await GroupMember.findOne({
          attributes: ['userId'],
          where: {
            userId: userId,
            groupId: groupId,
          },
        });
        console.log(groupMember.userId);
        if (!!groupMember && groupMember.userId) {
        } else {
          console.log('in no result');
          await GroupMember.create({
            userId: userId,
            groupId: groupId,
          })
            .then(() => {
              console.log('member created');
              random = -1;
              return;
            })
            .catch((error) => {
              console.log(error);
            });
          random = -1;
        }
      }

      response.send({
        status: 200,
        message: 'success. user joined the group',
      });
    } catch (error) {
      next(error);
    }
    return undefined;
  }
}

module.exports = new GroupController();
