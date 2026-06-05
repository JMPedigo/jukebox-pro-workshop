import express from "express";
const router = express.Router();
export default router;

import { createUser } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

/**POST /users/register creates a new user with the provided credentials
 * sends 400 if request body is missing username or password
 * make sure passwords are hashed!
 * creates and sends a token with the ID of the created user
 */
router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await createUser(username, password);
    const token = await createToken({ id: user.id });
    res.status(201).send(token);
  },
);
