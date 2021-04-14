import express from 'express';
import { validateId } from '../middlewares/validator';
import User from '../models/User';
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
 * /users:
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
 * /users:
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


export default userRouter;
