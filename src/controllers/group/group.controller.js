const Models = require('../../../models');
const moment = require('moment');
const {
    Op
} = require('sequelize')
const {
    Group,
    GroupMember,
    User,
    Restaurant
} = Models;

class GroupController {

    createGroup(request, response, next) {

        try {
            Group.create({
                time: new moment(request.body.time),
                officeId: request.body.officeId,
                restaurantId: request.body.restaurantId
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
                            })
                            console.log(user.id);
                            response.send({
                                status: 200,
                                message: "Success",
                            })
                        } else {
                            console.log('not creating group members');
                        }
                    })
                } else {
                    console.log('not');
                }
            });

        } catch (error) {
            next(error);
        }
        return undefined;
    }


    async getGroupList(request, response, next) {
        // currentDate = new moment();
        await User.findOne({
            attributes: ['id', 'officeId', 'authToken'],
            where: {
                authToken: request.body.authToken,
            },
        }).then(async (user) => {
            if (user) {

                Group.findAll({
                    attributes: ['id', 'officeId', 'restaurantId'],
                    where: {
                        officeId: user.officeId,
                        time: {
                            [Op.gte]: new Date()
                        }
                    },
                    include: [{
                        model: GroupMember,
                        as: 'groupMember',
                        attributes: ['userId'],
                        include: [{
                            model: User,
                            as: 'user',
                            attributes: ['name']
                        }]
                    }, {
                        model: Restaurant,
                        as: 'restaurant',
                        attributes: ['name']
                    }]
                }).then((result) => {


                    response.send({
                        status: 200,
                        message: "Success",
                        data: result,
                    })

                }).catch(error => {
                    console.log(error);
                })


            } else {
                response.send({
                    status: 400,
                    message: "Could not get user",
                })
            }
        }).catch(error => {
            console.log(error);
        })

    }
    joinGroup() {

    }
    joinRandomGroup() {

    }



}

module.exports = new GroupController();