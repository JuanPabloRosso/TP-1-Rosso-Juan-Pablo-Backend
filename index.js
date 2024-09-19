import { getUsers, getUserById, addUser, updateUser, deleteUser, PATH_FILE_USER, PATH_FILE_ERROR } from "./models.js";
import {createUserObject, createUpdateUserObject} from "./utils/createObjetcUser.js";
import { handleError } from "./utils/handleError.js";
import { help } from "./utils/help.js";

const args = process.argv.splice(2);
const option = args[0];

switch (option) {
  case "list":
    console.log(getUsers(PATH_FILE_USER));
    break;
  case "search":
    console.log(getUserById(args[1]));
    break;
  case "add":
    const newUser = createUserObject(args);
    console.log(addUser(newUser));
    break;
  case "update":
    const updatedUser = createUpdateUserObject(args);
    console.log(updateUser(updatedUser));
    break;
  case "delete":
    console.log(deleteUser(args[1]));
    break;
  case "help":
    console.log(help());
  break;
  default:
    const error = handleError(
      new Error("Comand Incorrect"), PATH_FILE_ERROR
    );
    console.log(error);
    break;
}