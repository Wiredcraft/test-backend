import appManager from "./app-manager";

export async function createUser() {
  const body = {
    name: "jack",
  };

  const res = await appManager
    .post("/users")
    .send(body)
    .expect(201)
    .expect("Content-Type", /json/);

  return res.body;
}
