const GroupService = require('./group.service');

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
    const { time, restaurantId } = request.body;
    try {
      const resp = await GroupService.createCustomGroup({
        authToken,
        time,
        restaurantId,
      });
      return resp
        ? response.send({
            status: 200,
            message: 'Success',
          })
        : response.status(400).send({
            message: 'Group not created',
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
      const list = await GroupService.getGroupsList({ authToken });
      return list
        ? response.send({
            status: 200,
            message: 'Success',
            data: list,
          })
        : response.status(400).send({
            message: 'Could not get user',
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
   * @param {Object} response 200 for success. 400 for failing
   * @returns {Object}
   */

  async joinGroup(request, response, next) {
    const authToken = request.headers.authorization;
    const groupId = request.params;
    try {
      const group = await GroupService.joinGroup({ authToken, groupId });
      return group
        ? response.send({
            status: 200,
            message: 'Group member is added',
          })
        : response.status(400).send({
            message: 'No user found',
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
    const { startTime, endTime } = request.body;
    try {
      const resp = await GroupService.joinRandomGroup({
        authToken,
        startTime,
        endTime,
      });
      if (resp && resp.status === 403) {
        return response.status(403).send({
          message: 'No group to join',
        });
      } else {
        return response.status(200).send({
          message: 'Group joined successfully',
        });
      }
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
   
   * @param {Object} response 200 for success. 400 for failing
   * @returns {Object}
   */

  async deleteGroup(request, response, next) {
    var groupId = request.params.groupId;
    try {
      await GroupService.deleteGroup({ groupId }).then((result) => {
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
   *
   * @param {Object} response 200 for success. 400 for failing
   * @returns {Object}
   */

  async leaveGroup(request, response, next) {
    const authToken = request.headers.authorization;
    const groupId = request.params.groupId;
    try {
      const resp = await GroupService.leaveGroup({ authToken, groupId });

      return resp
        ? response.send({
            status: 200,
            message: 'Group member is deleted',
          })
        : response.status(400).send({
            message: 'No user found',
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
    try {
      const resp = await GroupService.updateGroup({
        groupId: id,
        restaurantId,
      });
      return resp
        ? response.status(200).send({
            message: 'Group updated successfully',
          })
        : response.status(400).send({
            message: 'Group cannot be updated',
          });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GroupController();
