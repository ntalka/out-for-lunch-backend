const Models = require('../../../models');
const moment = require('moment');
const sequelize = require('sequelize');
const { Op } = sequelize;
const { Group, GroupMember, User, Restaurant } = Models;

class GroupController {
  /**
   * Creates group with given RestaurantId and Time
   *
   * @param {Object} request {
   * body: {
   *  restaurantId: String,
   *  time: String
   * },
   * headers: {
   *  authorization: authToken
   * }
   * }
   * @param {Object} response 200 for success. 400 for failing
   * @returns {Object}
   */

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
        time: new moment.utc(request.body.time),
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

  /**
   * Gets all the groups from the user's current office
   *
   * @param {Object} request {
   * headers: {
   *  authorization: authToken
   * }
   * }
   * @param {Object} response 200 for success. 400 for failing
   * @returns {Object}
   */

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
              order: [
                ['time', 'ASC'],
                [
                  {
                    model: Restaurant,
                    as: 'restaurant',
                  },
                  'name',
                  'ASC',
                ],
              ],
            }).then((result) => {
              const formattedResult = result.map((group) => {
                const isUserJoined = group.dataValues.groupMember.filter(
                  (gm) => gm.userId === user.id
                );
                return {
                  ...group.dataValues,
                  joined: isUserJoined.length > 0,
                };
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

  /**
   * Joins a group with the given group id
   *
   * @param {Object} request {
   * headers: {
   *  authorization: authToken
   * }
   * }
   * @param {Integer} groupId group id to join
   * @param {Object} response 200 for success. 400 for failing
   * @returns {Object}
   */

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
          await GroupMember.findOne({
            attributes: ['groupId'],
            where: {
              userId: user.id,
            },
          }).then(async (groupMemberResult) => {
            if (groupMemberResult) {
              await GroupMember.destroy({
                where: {
                  userId: user.id,
                },
              });
            }
          });

          await GroupMember.create({
            userId: user.id,
            groupId: request.params.groupId,
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

  /**
   * Joins a random group between the given start time and endtime
   *
   * @param {Object} request {
   * headers: {
   *  authorization: authToken
   * }
   * body: {
   *  startTime: String,
   *  endTime: String
   * },
   * }
   * @param {Object} response 200 for success. 400 for failing
   * @returns {Object}
   */

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

  /**
   * Deletes the group with the given group id
   *
   * @param {Object} request {
   * headers: {
   *  authorization: authToken
   * }
   * }
   * @param {Integer} groupId group id to delete
   * @param {Object} response 200 for success. 400 for failing
   * @returns {Object}
   */

  async deleteGroup(request, response, next) {
    var groupId = request.params.groupId;
    try {
      await Group.destroy({
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

  /**
   * User leaves the group with the given group id
   *
   * @param {Object} request {
   * headers: {
   *  authorization: authToken
   * }
   * }
   * @param {Integer} groupId group id to leave
   * @param {Object} response 200 for success. 400 for failing
   * @returns {Object}
   */

  async leaveGroup(request, response, next) {
    const authToken = request.headers.authorization;
    try {
      await User.findOne({
        attributes: ['id'],
        where: {
          authToken,
        },
      }).then(async (user) => {
        if (user) {
          await GroupMember.destroy({
            where: {
              userId: user.id,
              groupId: request.params.groupId,
            },
          });

          return response.send({
            status: 200,
            message: 'Group member is deleted',
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

  /**
   * Updates the group with the given new restaurant id
   *
   * @param {Object} request {
   * headers: {
   *  authorization: authToken
   * }
   * }
   * body: {
   *  restaurantId: String
   * },
   * @param {Integer} id group id to update
   * @param {Object} response 200 for success. 400 for failing
   * @returns {Object}
   */

  async updateGroup(request, response, next) {
    var id = request.params.id;
    var restaurantId = request.body.restaurantId;
    await Group.findOne({
      where: {
        id,
      },
    }).then(async (group) => {
      if (group) {
        group.restaurantId = restaurantId;
        await group.save();
        response.status(200).send({
          message: 'Restaurant changed Successfully',
        });
      } else {
        response.status(400).send({
          message: 'Failed to change restaurant',
        });
      }
    });
  }
}

module.exports = new GroupController();
