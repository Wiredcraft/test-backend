import app from "./app-manager";

export async function createUser(name) {
  const body = {
    name: name || "jack",
  };

  const res = await app
    .post("/users")
    .send(body)
    .expect(201)
    .expect("Content-Type", /json/);

  return res.body;
}

export async function createFriendship(from, to) {
  const res = await app
    .post(`/friendships/edit/${from}/${to}`)
    .expect(201)
    .expect("Content-Type", /json/);

  return res.body;
}
