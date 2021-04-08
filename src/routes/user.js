import express from 'express';
import { validateId } from '../middlewares/validator';
import User from '../models/User';

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find();
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.get('/:id', validateId('User'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    dob: req.body.dob,
    address: req.body.address,
    description: req.body.description
  });

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.put('/:id', validateId('User'), async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          dob: req.body.dob,
          address: req.body.address,
          description: req.body.description
        }
      },
      {
        new: true
      });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.delete('/:id', validateId('User'), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "User not found" });
    }

  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});


export default userRouter;
