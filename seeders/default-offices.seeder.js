const sequelize = require('sequelize');
const { Op } = sequelize;
const Models = require('../models');

const { Office } = Models;
const DefaultOfficesSeeder = async () => {
  const isAlreadyExists = await Office.findAll({
    where: {
      deletedAt: {
        [Op.eq]: null,
      },
    },
  });
  if (isAlreadyExists > 0) {
    return '';
  }
  let offices = [
    {
      name: 'Tampere HVT11',
      location: '61.49142122101034,23.770750652503075',
    },
    {
      name: 'Tampere HVT34',
      location: '61.4872349013685,23.771011831141426',
    },
    { name: 'Espoo', location: '60.17320724919939,24.82951312687209' },
    { name: 'Hyvinkää', location: '60.61885645330777,24.81364812340716' },
    { name: 'Oulu', location: '65.0573847614918,25.443263561914264' },
    {
      name: 'Vaasa Wasa Innovation Center',
      location: '63.116523411260665,21.62020520510232',
    },
    {
      name: 'Vaasa Wulffintie',
      location: '63.09815319119998,21.601082366419462',
    },
    { name: 'Seinäjoki', location: '62.80052477778116,22.822913653422315' },
    { name: 'Jyväskylä', location: '62.244890931070074,25.750669670647447' },
    { name: 'Kotka', location: '60.51600193933175,26.928281488329468' },
    { name: 'Ylivieska', location: '64.07478730741482,24.51536955120399' },
    { name: 'Kokkola', location: '63.83473200917329,23.123709317260648' },
    { name: 'Turku', location: '60.44991173801938,22.293984601059858' },
    { name: 'Kuopio', location: '62.890139950100824,27.63171036451606' },
    { name: 'Prague', location: '50.08481700492511,14.44251624731215' },
  ];

  return await Office.bulkCreate([...offices])
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('default offices added successfully!');
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('default offices seeder error', error);
    });
};

module.exports = DefaultOfficesSeeder;
