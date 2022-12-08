const Models = require('../../../models');
const moment = require('moment');
const sequelize = require('sequelize');
const { Op } = sequelize;
const { Group, GroupMember, User, Restaurant } = Models;

class GroupService {
  async createGroupMember({ userId, groupId }) {
    await Promise.all([
      await GroupMember.destroy({
        where: {
          userId,
        },
      }),
      await GroupMember.create({
        userId,
        groupId,
      }),
    ]);
  }
  async createCustomGroup({ authToken, time, restaurantId }) {
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
    return await Group.create({
      time: new moment.utc(time),
      officeId,
      restaurantId: restaurantId,
    })
      .then(async (group) => {
        if (group) {
          await this.createGroupMember({ userId, groupId: group.id });
          return true;
        } else {
          return null;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async getGroupsList({ authToken }) {
    return await User.findOne({
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
            return formattedResult;
          });
        } else {
          return null;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async joinGroup({ authToken, groupId }) {
    return await User.findOne({
      attributes: ['id'],
      where: {
        authToken,
      },
    }).then(async (user) => {
      if (user) {
        await this.createGroupMember({ userId: user.id, groupId });
        return true;
      } else {
        return null;
      }
    });
  }

  async joinRandomGroup({ authToken, startTime, endTime }) {
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
      return { status: 403 };
    }

    return await GroupMember.findOne({
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
      }
      return await this.createGroupMember({ userId, groupId });
    });
  }

  async deleteGroup({ groupId }) {
    return await Group.destroy({
      where: {
        id: groupId,
      },
    });
  }

  async leaveGroup({ authToken, groupId }) {
    return await User.findOne({
      attributes: ['id'],
      where: {
        authToken,
      },
    }).then(async (user) => {
      if (user) {
        await GroupMember.destroy({
          where: {
            userId: user.id,
            groupId,
          },
        });

        return true;
      } else {
        return null;
      }
    });
  }

  async updateGroup({ groupId, restaurantId }) {
    return Group.update(
      {
        restaurantId,
      },
      {
        where: {
          id: groupId,
        },
      }
    );
  }
}

module.exports = new GroupService();
