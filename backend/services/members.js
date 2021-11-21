import moment from 'moment';
import { Member } from '../db/models';

export const list = async (req, res, next) => {
  try {
    const data = await Member.findAll();
    res.send(data);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const data = await Member.findOne({ where: { id: req.params.id } });
    res.send(data);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  /*
   * We should put some validation middleware to there, to verify the inputs.
   */
  const values = {
    name: req.body.name,
    dob: req.body.dob,
    address: {
      type: 'Point',
      coordinates: req.body.address,
    },
    description: req.body.description,
    createdAt: moment().tz('Asia/Shanghai'), // Timezone should in localization
  };
  try {
    const member = await Member.create(values);
    res.send({ id: member.id });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  const data = await Member.findOne({ where: { id: req.params.id } });
  if (!data) {
    res.sendStatus(404);
    return;
  }

  data.name = req.body.name;
  data.dob = req.body.dob;
  data.address = {
    type: 'Point',
    coordinates: req.body.address,
  };
  data.description = req.body.description;
  try {
    await data.save();
    res.send({
      updated: true,
    });
  } catch (err) {
    next(err);
  }
};

export const destory = async (req, res, next) => {
  const data = await Member.findOne({ where: { id: req.params.id } });
  if (!data) {
    res.sendStatus(404);
    return;
  }

  try {
    await data.destroy();
    res.send({
      deleted: true,
    });
  } catch (err) {
    next(err);
  }
};
