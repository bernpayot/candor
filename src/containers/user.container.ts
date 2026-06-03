import { UserRepository } from "../repositories/user.repository.js";
import { UserService } from "../services/user.service.js";
import { UserController } from "../controllers/user.controller.js";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
export const userController = new UserController(userService);
