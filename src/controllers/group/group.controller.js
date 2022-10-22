const Models = require('../../../models');
const moment = require('moment')
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
                            console.log(user.id);
                            response.send({
                                status: 200,
                                message: "Success",
                            })
                        }
                    })
                }
                else {
                    console.log('not');
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
    joinGroup() {

    }
    joinRandomGroup() {

    }



}

module.exports = new GroupController();