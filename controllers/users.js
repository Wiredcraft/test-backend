import { v4 as uuidv4 } from "uuid";

let users = [];

export const getUsers = (req, res) => {
  res.send(users);
};

export const getUser = (req, res) => {
  const { id } = req.params;

  const foundUser = users.find((x) => x.id === id);

  res.send(foundUser);
};

export const createUser = (req, res) => {
  const user = req.body;

  users.push({ ...user, id: uuidv4() });

  res.send(`user ${user.name} is added.`);
};

export const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, dob, address, description } = req.body;

  const user = users.find((x) => x.id === id);

  if (name) user.name = name;
  if (dob) user.dob = dob;
  if (address) user.address = address;
  if (description) user.description = description;

  res.send(`User with the id ${id} has been updated.`);
};

export const deleteUser = (req, res) => {
  const { id } = req.params;

  users = users.filter((x) => x.id !== id);

  res.send(`User with the id ${id} is deleted.`);
};
