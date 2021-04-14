import express from 'express';
import { validateId } from '../middlewares/validator';
import User from '../models/User';
import Friendship from '../models/Friendship';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
const userRouter = express.Router();

/**
 * @swagger
 * path:
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get a list of users
 *     parameters: TODO add pagination
 *     responses:
 *       '200':
 *         description: An array of user objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find();
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * path:
 * /users/{userId}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user by id
 *     parameters:
 *       - name: userId
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the user
 *     responses:
 *       '200':
 *         description: A user object which has been retrieved with the provided userId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.get('/:id', validateId('User'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * path:
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: A user object which has been created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    dob: req.body.dob,
    address: req.body.address,
    location: req.body.location, //TODO: validate coordinates.
    description: req.body.description
  });

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * path:
 * /users/{userId}:
 *   put:
 *     tags: [Users]
 *     summary: Update an existing user
 *     parameters:
 *       - name: userId
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: A user object which has been updated 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.put('/:id', validateId('User'), async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          dob: req.body.dob,
          address: req.body.address,
          location: req.body.location,
          description: req.body.description
        }
      },
      {
        new: true
      });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * path:
 * /users/{userId}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete an existing user
 *     parameters:
 *       - name: userId
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the user
 *     responses:
 *       '204':
 *         description: An empty response body to indicate the user has been deleted
 */
userRouter.delete('/:id', validateId('User'), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'User not found' });
    }

  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


/**
 * @swagger
 * path:
 * /users/{userId}/followers:
 *   get:
 *     tags: [Users]
 *     summary: Get a list of users who follow the provided user
 *     parameters:
 *       - name: userId
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the user who's being followed
 *       - name: distinaceWithin
 *         in: query
 *         schema:
 *           type: number
 *         required: false
 *         description: filter the followers within the distance (in meters)
 *     responses:
 *       '200':
 *         description: An array of user objects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.get('/:id/followers', validateId('User'), async (req, res) => {
  const followeeId = req.params.id;
  const maxDistance = req.query.distinaceWithin;
  try {
    const user = await User.findById(followeeId);
    if (!user) {
      return res.status(404).json({ message: `User ${followeeId} not found` });
    }

    const friendships = await Friendship.find({ followeeId: followeeId });
    if (friendships.length) {
      const followerIds = friendships.map(a => a.followerId);
      let conditions = { _id: { $in: followerIds } };

      if (maxDistance) {
        // if distinaceWithin is provided, filter the followers with it as well.
        conditions.location = {
          $near: {
            $geometry: user.location,
            $maxDistance: maxDistance
          }
        };
      }

      const followerUsers = await User.find(conditions);
      res.status(200).json(followerUsers);
    } else {
      res.status(404).json({ message: 'Follower user not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * path:
 * /users/{userId}/followings:
 *   get:
 *     tags: [Users]
 *     summary: Get a list of users whom the provided user follows
 *     parameters:
 *       - name: userId
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the user who's following
 *       - name: distinaceWithin
 *         in: query
 *         schema:
 *           type: number
 *         required: false
 *         description: filter the followees within the distance (in meters)
 *     responses:
 *       '200':
 *         description: An array of user objects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.get('/:id/followings', validateId('User'), async (req, res) => {
  const followerId = req.params.id;
  const maxDistance = req.query.distinaceWithin;
  try {
    const user = await User.findById(followerId);
    if (!user) {
      return res.status(404).json({ message: `User ${followerId} not found` });
    }


    const friendships = await Friendship.find({ followerId: followerId });
    if (friendships.length) {
      const followeeIds = friendships.map(a => a.followeeId);
      let conditions = { _id: { $in: followeeIds } };

      if (maxDistance) {
        // if distinaceWithin is provided, filter the followees with it as well.
        conditions.location = {
          $near: {
            $geometry: user.location,
            $maxDistance: maxDistance
          }
        };
      }

      const followeeUsers = await User.find(conditions);
      res.status(200).json(followeeUsers);
    } else {
      res.status(404).json({ message: 'Followee user not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * path:
 * /users/{userId}/followers/{followerUserId}:
 *   post:
 *     tags: [Users]
 *     summary: Create a new friendship
 *     parameters:
 *       - name: userId
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the user who's being followed
 *       - name: followerUserId
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the user who's following
 *     responses:
 *       '201':
 *         description: A user object which has been created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Friendship'
 */
userRouter.post('/:id/followers/:followerId', validateId('User'), async (req, res) => {
  const followeeId = req.params.id;
  const followerId = req.params.followerId;
  if (followeeId == followerId) {
    res.status(400).json({ message: 'A user cannot follow him/herself' });
  }

  try {
    const existingFridenship = await Friendship.find({
      followeeId: followeeId,
      followerId: followerId
    });

    if (existingFridenship.length != 0) {
      // the friendship already exists.
      return res.status(200).json(existingFridenship[0]);
    } else {
      // the friendship does not exist.

      // both followee and follower should exist
      const users = await User.find({
        _id: { $in: [followeeId, followerId] }
      });
      if (users.length != 2) {
        return res.status(404).json({ message: 'User not found' });
      }

      const friendship = new Friendship({
        followeeId: followeeId,
        followerId: followerId
      });

      const savedFiendship = await friendship.save();
      res.status(201).json(savedFiendship);
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }

});


/**
 * @swagger
 * path:
 * /users/{userId}/followers/{followerUserId}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete an existing friendship
 *     parameters:
 *       - name: userId
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the user who's being followed
 *       - name: followerUserId
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the user who's following
 *     responses:
 *       '204':
 *         description: An empty response body to indicate the user has been deleted
 */
userRouter.delete('/:id/followers/:followerId', validateId('User'), async (req, res) => {
  try {
    const deletedFriendship = await Friendship.findOneAndDelete({
      followeeId: req.params.id,
      followerId: req.params.followerId
    });
    if (deletedFriendship) {
      res.status(204).json();
    } else {
      res.status(404).json({ message: 'Friendship not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default userRouter;
