const Models = require('../../../models');
const moment = require('moment');
const { request } = require('../../../app');
const {
    Group,
    GroupMember,
    User,
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
                            // console.log(user.id);
                            response.send({
                                status: 200,
                                message: "Success",
                            })
                        }else{
                            response.send({
                                status: 400,
                                message: "No user found",
                            })
                        }
                    })
                }
                else {
                    response.send({
                        status: 400,
                        message: "No group created",
                    })
                }
            });

        }
        catch (error) {
            next(error);
        }
        return undefined;
    }
    getGroupList() {


    }
    
    async joinGroup(request, response, next){

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
                        })

                        response.send({
                            status: 200,
                            message: "Group member is added",
                        })
                    }else{
                        response.send({
                            status: 400,
                            message: "No user found",
                        })
                    }
                });
            }
            catch (error) {
                next(error);
            }
            return undefined;
        }


   
        joinRandomGroup() 
    {


    }



}

module.exports = new GroupController();