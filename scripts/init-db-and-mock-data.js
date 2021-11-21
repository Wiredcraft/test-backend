import moment from 'moment';
import { initDB } from '../backend/db/init';
import { Member } from '../backend/db/models';

const sleep = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 5000);
  });
};

// This script just for test
const runInit = () => {
  initDB({ logging: console.log })
    .then(async () => {
      await Member.bulkCreate([
        {
          name: 'Jack',
          dob: '9999-99-99',
          address: { type: 'Point', coordinates: [121.461966, 31.220272] },
          description: 'cool guy',
          createdAt: moment().tz('Asia/Shanghai'),
        },
        {
          name: 'Daniel Craig',
          dob: '1968-03-03',
          address: { type: 'Point', coordinates: [121.458715, 31.221061] },
          description: 'Daniel Wroughton Craig is an English actor.',
          createdAt: moment().tz('Europe/London'),
        },
        {
          name: 'Léa Seydoux',
          dob: '1985-07-01',
          address: { type: 'Point', coordinates: [121.4141971, 31.202561] },
          description:
            'Léa Hélène Seydoux-Fornier de Clausonne is a French actress.',
          createdAt: moment().tz('Europe/Paris'),
        },
        {
          name: 'Rami Malek',
          dob: '1981-05-12',
          address: { type: 'Point', coordinates: [121.4696613, 31.191233] },
          description: 'Rami Said Malek is an American actor.',
          createdAt: moment().tz('America/Los_Angeles'),
        },
        {
          name: 'Lashana Lynch',
          dob: '1987-11-27',
          address: { type: 'Point', coordinates: [121.456958, 31.194903] },
          description: 'Lashana Lynch is a British actress.',
          createdAt: moment().tz('Europe/London'),
        },
        {
          name: 'Ana de Armas',
          dob: '1988-04-30',
          address: { type: 'Point', coordinates: [121.469427, 31.202543] },
          description: 'Ana Celia de Armas Caso is a Cuban-Spanish actress.',
          createdAt: moment().tz('America/Havana'),
        },
      ]);

      process.exit();
    })
    .catch(async (err) => {
      console.info('Wating for database...');
      await sleep();
      runInit();
    });
};

runInit();
