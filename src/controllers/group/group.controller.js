const Models = require('../../../models');
const moment = require('moment');
const sequelize = require('sequelize');
const Sequelize = require('../../../config/config');
const {
  Op,
  QueryTypes
} = sequelize;
const {
  Group,
  GroupMember,
  User,
  Restaurant
} = Models;

class GroupController {
  async createCustomGroup(request, response, next) {
    try {
      let {
        userId,
        officeId
      } = await User.findOne({
          attributes: ['id', 'officeId'],
          where: {
            authToken: request.body.authToken,
          },
        })
        .then(async (user) => {
          if (user) {
            return {
              userId: user.id,
              officeId: user.officeId
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
          response.send({
            status: 200,
            message: 'Success',
          });
        } else {
          response.status(400).send({
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
    try {



      var test = moment(request.body.startTime).diff(moment(request.body.endTime), 'minutes');
      var timeDifference = Math.abs(test);

      var slotCount = timeDifference / 15;
      var random = Math.floor(Math.random() * slotCount);

      var startTime = moment(request.body.startTime);

      var time = random * 15;

      var finalTime = moment(request.body.startTime).add(time, 'minutes');



      response.send({
        data: [request.body.startTime, finalTime, random, moment.parseZone(finalTime).local(true).format()]
      });



      // let {
      //   userId,
      //   officeId
      // } = await User.findOne({
      //     attributes: ['id', 'officeId'],
      //     where: {
      //       authToken: request.body.authToken,
      //     },
      //   })
      //   .then(async (user) => {
      //     if (user) {
      //       return {
      //         userId: user.id,
      //         officeId: user.officeId
      //       };
      //     } else return null;
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });

      // let filteredRestaurants = [];

      // const nearByRestaurants = await Sequelize.query(
      //   `SELECT id FROM restaurants WHERE JSON_CONTAINS(nearby_office, \'[${officeId}]\')`, {
      //     type: QueryTypes.SELECT,
      //   }
      // ).then((resp) => {
      //   if (resp) {
      //     return resp.map((rest) => rest.id);
      //   } else return [];
      // });

      // if (!nearByRestaurants.length) {
      //   response.status(400).send({
      //     message: 'No restaurant found',
      //   });
      // }

      // var random = 0;


      // await GroupMember.findOne({
      //   // attributes: ['user', 'officeId'],
      //   where: {
      //     userId: userId,
      //   },
      // }).then(async (groupMemberResult) => {
      //   if (groupMemberResult) {

      //     await Group.findOne({
      //       where: {
      //         id: groupMemberResult.groupId
      //       }
      //     }).then(async (groupResult) => {
      //       if (groupResult) {
      //         filteredRestaurants = nearByRestaurants.filter((filterItem) => filterItem !== groupResult.restaurantId);
      //         random = Math.floor(Math.random() * filteredRestaurants.length);
      //         let restaurantId = filteredRestaurants[random];
      //         await Group.create({
      //           restaurantId,
      //           officeId,
      //           time: new moment(request.body.time),
      //         }).then(async (result) => {

      //           await GroupMember.destroy({
      //             where: {
      //               userId: userId
      //             }
      //           })
      //           await GroupMember.create({
      //             userId: userId,
      //             groupId: result.id
      //           })

      //         })

      //         response.send({
      //           status: 200,
      //           message: 'New Group Created successfully',
      //         });
      //       } else {
      //         response.send({
      //           status: 400,
      //           message: 'Error finding previous group',
      //         });
      //       }
      //     })
      //   } else {
      //     // filteredRestaurants = nearByRestaurants.map().filter((filterItem) => filterItem.id === groupResult.restaurantId);
      //     random = Math.floor(Math.random() * nearByRestaurants.length);
      //     let restaurantId = nearByRestaurants[random];

      //     await Group.create({
      //       restaurantId,
      //       officeId,
      //       time: new moment(request.body.time),
      //     }).then(async (result) => {
      //       await GroupMember.destroy({
      //         where: {
      //           userId: userId
      //         }
      //       })
      //       await GroupMember.create({
      //         userId: userId,
      //         groupId: result.id
      //       })

      //     })

      //     response.send({
      //       status: 200,
      //       message: 'Group Created successfully',
      //     });
      //   }
      // })





    } catch (error) {
      next(error);
    }
    return undefined;
  }

  async getGroupsList(request, response, next) {
    try {
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
              include: [{
                  model: GroupMember,
                  as: 'groupMember',
                  attributes: ['userId'],
                  include: [{
                    model: User,
                    as: 'user',
                    attributes: ['name'],
                  }, ],
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
    } catch (error) {
      next(error);
    }
    return undefined;
  }

  async joinGroup(request, response, next) {
    try {
      await User.findOne({
        attributes: ['id'],
        where: {
          authToken: request.body.authToken,
        },
      }).then(async (user) => {
        if (user) {
          GroupMember.create({
            userId: user.id,
            groupId: request.body.groupId,
          });

          response.send({
            status: 200,
            message: 'Group member is added',
          });
        } else {
          response.send({
            status: 400,
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
    try {
      let {
        userId,
        officeId
      } = await User.findOne({
          attributes: ['id', 'officeId'],
          where: {
            authToken: request.body.authToken,
          },
        })
        .then(async (user) => {
          if (user) {
            return {
              userId: user.id,
              officeId: user.officeId
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
            time: {
              [Op.gte]: new Date()
            },
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

      let random = 1;
      while (random >= 0) {
        random = Math.floor(Math.random() * groupIds.length);
        let groupId = groupIds[random];
        const groupMember = await GroupMember.findOne({
          attributes: ['userId'],
          where: {
            userId: userId,
            groupId: groupId,
          },
        });
        random = -1;
        if (!groupMember) {
          await GroupMember.create({
              userId: userId,
              groupId: groupId,
            })
            .then(() => {
              random = -1;
              response.send({
                status: 200,
                message: 'Group joined successfully',
              });
            })
            .catch((error) => {
              console.log(error);
              response.status(400).send({
                message: 'Group could not be joined',
              });
              random = -1;
            });
        } else if (groupIds.length === 1) {
          response.send({
            status: 200,
            message: 'Group already joined',
          });
          random = -1;
        }
      }
    } catch (error) {
      next(error);
    }
    return undefined;
  }
}

module.exports = new GroupController();