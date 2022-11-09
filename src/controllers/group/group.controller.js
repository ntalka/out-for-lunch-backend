const Models = require('../../../models');
const moment = require('moment');
const sequelize = require('sequelize');
const Sequelize = require('../../../config/config');
const { Op, QueryTypes } = sequelize;
const { Group, GroupMember, User, Restaurant } = Models;

class GroupController {
  async createCustomGroup(request, response, next) {
    const authToken = request.headers.authorization;
    try {
      let { userId, officeId } = await User.findOne({
        attributes: ['id', 'officeId'],
        where: {
          authToken,
        },
      })
        .then(async (user) => {
          if (user) {
            return {
              userId: user.id,
              officeId: user.officeId,
            };
          } else return null;
        })
        .catch((error) => {
          console.log(error);
        });
      await Group.create({
        time: new moment(request.body.time),
        officeId: officeId,
        restaurantId: request.body.restaurantId,
      }).then(async (group) => {
        if (group) {
          await GroupMember.create({
            userId,
            groupId: group.id,
          });
          return response.send({
            status: 200,
            message: 'Success',
          });
        } else {
          return response.status(400).send({
            message: 'Group not created',
          });
        }
      });
    } catch (error) {
      next(error);
    }
    return undefined;
  }

  async createRandomGroup(request, response, next) {
    const authToken = request.headers.authorization;
    try {
      var test = moment(request.body.startTime).diff(
        moment(request.body.endTime),
        'minutes'
      );
      var timeDifference = Math.abs(test);

      var slotCount = timeDifference / 15;
      var randomTime = Math.floor(Math.random() * slotCount);

      var time = randomTime * 15;

      var finalTime = moment
        .parseZone(moment(request.body.startTime).add(time, 'minutes'))
        .local(true)
        .format();
      let { userId, officeId } = await User.findOne({
        attributes: ['id', 'officeId'],
        where: {
          authToken,
        },
      })
        .then(async (user) => {
          if (user) {
            return {
              userId: user.id,
              officeId: user.officeId,
            };
          } else return null;
        })
        .catch((error) => {
          console.log(error);
        });

      let filteredRestaurants = [];

      const nearByRestaurants = await Sequelize.query(
        `SELECT id FROM restaurants WHERE JSON_CONTAINS(nearby_office, \'[${officeId}]\')`,
        {
          type: QueryTypes.SELECT,
        }
      ).then((resp) => {
        if (resp) {
          return resp.map((rest) => rest.id);
        } else return [];
      });

      if (!nearByRestaurants.length) {
        return response.status(400).send({
          message: 'No restaurant found',
        });
      }

      var random = 0;

      await GroupMember.findOne({
        where: {
          userId: userId,
        },
      }).then(async (groupMemberResult) => {
        if (groupMemberResult) {
          await Group.findOne({
            where: {
              id: groupMemberResult.groupId,
            },
          }).then(async (groupResult) => {
            if (groupResult) {
              filteredRestaurants = nearByRestaurants.filter(
                (filterItem) => filterItem !== groupResult.restaurantId
              );
              random = Math.floor(Math.random() * filteredRestaurants.length);
              let restaurantId = filteredRestaurants[random];
              await Group.create({
                restaurantId,
                officeId,
                time: finalTime,
              }).then(async (result) => {
                await GroupMember.destroy({
                  where: {
                    userId: userId,
                  },
                });
                await GroupMember.create({
                  userId: userId,
                  groupId: result.id,
                });
              });

              return response.send({
                status: 200,
                message: 'New Group Created successfully',
                data: [finalTime, randomTime],
              });
            } else {
              return response.status(400).send({
                message: 'Error finding previous group',
              });
            }
          });
        } else {
          random = Math.floor(Math.random() * nearByRestaurants.length);
          let restaurantId = nearByRestaurants[random];

          await Group.create({
            restaurantId,
            officeId,
            time: finalTime,
          }).then(async (result) => {
            await GroupMember.destroy({
              where: {
                userId: userId,
              },
            });
            await GroupMember.create({
              userId: userId,
              groupId: result.id,
            });
          });

          return response.send({
            status: 200,
            message: 'Group Created successfully',
            data: [finalTime, randomTime],
          });
        }
      });
    } catch (error) {
      next(error);
    }
    return undefined;
  }

  async getGroupsList(request, response, next) {
    const authToken = request.headers.authorization;
    try {
      await User.findOne({
        attributes: ['id', 'officeId', 'authToken'],
        where: {
          authToken,
        },
      })
        .then(async (user) => {
          if (user) {
            await Group.findAll({
              attributes: ['id', 'officeId', 'restaurantId', 'time'],
              where: {
                officeId: user.officeId,
                time: {
                  [Op.gte]: new Date(), //gte = greater than equal to
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
              const formattedResult = result.map((group) => {
                const isUserJoined = group.dataValues.groupMember.filter(
                  (gm) => gm.userId === user.id
                );
                return { ...group.dataValues, joined: isUserJoined.length > 0 };
              });
              return response.send({
                status: 200,
                message: 'Success',
                data: formattedResult,
              });
            });
          } else {
            return response.status(400).send({
              message: 'Could not get user',
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      next(error);
    }
    return undefined;
  }

  async joinGroup(request, response, next) {
    const authToken = request.headers.authorization;
    try {
      await User.findOne({
        attributes: ['id'],
        where: {
          authToken,
        },
      }).then(async (user) => {
        if (user) {
          await GroupMember.create({
            userId: user.id,
            groupId: request.body.groupId,
          });

          return response.send({
            status: 200,
            message: 'Group member is added',
          });
        } else {
          return response.status(400).send({
            message: 'No user found',
          });
        }
      });
    } catch (error) {
      next(error);
    }
    return undefined;
  }

  async joinRandomGroup(request, response, next) {
    const authToken = request.headers.authorization;
    try {
      let { userId, officeId } = await User.findOne({
        attributes: ['id', 'officeId'],
        where: {
          authToken,
        },
      })
        .then(async (user) => {
          if (user) {
            return {
              userId: user.id,
              officeId: user.officeId,
            };
          } else return null;
        })
        .catch((error) => {
          console.log(error);
        });

      const { startTime, endTime } = request.body;
      const groupIds = await Group.findAll({
        attributes: ['id'],
        where: {
          officeId: officeId,
          [Op.and]: [
            {
              time: {
                [Op.gte]: new moment(startTime),
              },
            },
            {
              time: {
                [Op.lte]: new moment(endTime),
              },
            },
          ],
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

      if (groupIds.length < 1) {
        return response.status(400).send({
          message: 'No group to join',
        });
      }

      await GroupMember.findOne({
        attributes: ['groupId'],
        where: {
          userId: userId,
        },
      }).then(async (groupMemberResult) => {
        let random = Math.floor(Math.random() * groupIds.length);
        let groupId = groupIds[random];
        if (groupMemberResult) {
          const filteredGroups = groupIds.filter(
            (id) => id !== groupMemberResult.groupId
          );
          random = Math.floor(Math.random() * groupIds.length);
          groupId = filteredGroups[random];
          await GroupMember.destroy({
            where: {
              userId,
            },
          });
        }
        await GroupMember.create({
          userId: userId,
          groupId,
        })
          .then(() => {
            return response.status(200).send({
              message: 'Group joined successfully',
            });
          })
          .catch((error) => {
            console.log(error);
            return response.status(400).send({
              message: 'Group could not be joined',
            });
          });
      });
    } catch (error) {
      next(error);
    }
    return undefined;
  }


  async deleteGroup(request, response, next) {
    var groupId = request.params.groupId;
    try {
      Group.destroy({
        where: {
          id: groupId,
        },
      }).then((result) => {

        if (result) {
          response.send({
            status: 200,
            message: `Successfully Deleted Group : ${groupId}`,
          });
        } else {
          response.send({
            status: 400,
            message: `Failed to Delete Group : ${groupId}. Can not find the group`,
          });
        }

      });


    } catch (error) {
      next(error);
    }
  }


}

module.exports = new GroupController();
