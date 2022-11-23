const Models = require('../../../models');
const { Office } = Models;

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
      }).then(async (Result) => {
        if (Result) {
          return res.send({
            status: 200,
            message: 'Offices Fetched Successfully',
            data: Result,
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
}

module.exports = new OfficeController();
