import { Member } from '../db/models';
import { Sequelize } from 'sequelize';
import { checkSchema, validationResult } from 'express-validator';

// Search firends in the boundary which is created by a point
/*
There are three typical approachs to implement the search of near firends:

[ ]  1. Using ST_Distance(a PostGIS function) to calculate the real distance between me and my firend.
        This approach is slowest, and just in fit of thousands or ten-thousands data.

[√]  2. Creating a buffer to my coordinate, and search according the boundary of the buffer.
        This way in fit of scenario of millions user.

[ ]  3. Caching all locations as GeoHashing (a spatial hashing-map). Whereas, all of the hashing should stored
        in a ElasticSearch cluster. This could stand over trillions user.
*/
export const findInBoundary = async (req, res, next) => {
  /*
  A typical sql:
  SELECT 
    me.id, me.name, ST_AsText(me.address), me.address, 
    ROUND((ST_Distance(me.address, ST_GeomFromText('POINT(121.468023 31.205885)', 4326)) * 1000 * 30)::numeric) as distance
  FROM members me
  WHERE
    ST_Intersects(
      me.address,
      ST_Buffer(
        ST_GeomFromText('POINT(121.468023 31.205885)', 4326), 
        ROUND(((500 / 30)::numeric / 1000)::numeric, 4), 
        'endcap=square quad_segs=4')
      )

  Note: ST_Buffer(point, range, options), the range is degree of 360 here, 
        which means arc of earth, 0.001 degree is about 30 meter.
        But under the CRS of EPSG:3857, the range should be a real distance in meter.
        So, 500 under the ST_Buffer is range of the search.
  */
  const point = `POINT(${req.query.long} ${req.query.lat})`;
  const distance = req.query.distance;

  const where = Sequelize.where(
    Sequelize.fn(
      'ST_Intersects',
      Sequelize.col('address'),
      Sequelize.fn(
        'ST_Buffer',
        Sequelize.fn('ST_GeomFromText', point, 4326),
        Sequelize.fn(
          'ROUND',
          Sequelize.literal(`((${distance} / 30)::numeric / 1000)::numeric`),
          4
        ),
        'endcap=square quad_segs=4'
      )
    ),
    true
  );

  const attributes = [
    'id',
    'name',
    [Sequelize.fn('ST_AsText', Sequelize.col('address')), 'location'],
    [
      Sequelize.literal(
        `ROUND((ST_Distance("address", ST_GeomFromText('${point}', 4326)) * 1000 * 30)::numeric)`
      ),
      'distance',
    ],
  ];

  try {
    const data = await Member.findAll({
      attributes,
      where,
    });

    res.send(data);
  } catch (err) {
    next(err);
  }
};

// Check received values
export const validator = checkSchema({
  distance: {
    errorMessage: 'distance is wrong',
    isInt: true,
    toInt: true,
  },
  long: {
    errorMessage: 'longitude is wrong',
    isFloat: {
      options: {
        min: -180,
        max: 180,
      },
    },
    toFloat: true,
  },
  lat: {
    errorMessage: 'latitude is wrong',
    isFloat: {
      options: {
        min: -90,
        max: 90,
      },
    },
    toFloat: true,
  },
});

export const validation = (req, res, next) => {
  const result = validationResult(req).array();
  if (result.length) {
    res.status(400).send(result);
  } else {
    next();
  }
};
