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
}

module.exports = new OfficeController();
