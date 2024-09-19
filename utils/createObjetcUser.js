import { handleError } from "./handleError.js";
import dotenv from "dotenv";

dotenv.config();
const createUserObject = (args) => {
  try { // Dejamos el Try Catch por lo conversado en clase pero entendemos que puede no cumplir funcion
    const [nombre, apellido, email, password] = args.slice(1); 
    // Retiramos validacion por no ser necesaria, ya existe en models (updateUser)
    return {
    nombre, 
    apellido, 
    email, 
    password
  };
  } catch (error) {
    const objError = handleError(error, process.env.PATH_FILE_ERROR);
    return objError;
  }
};

const createUpdateUserObject = (args) => {
  try { // Dejamos el Try Catch por lo conversado en clase pero entendemos que puede no cumplir funcion
    const [id, nombre, apellido, email, password] = args.slice(1);
    // Retiramos validacion por no ser necesaria, ya existe en models (updateUser)
    const updatedUser = {};
    updatedUser.id = id;    
    if (nombre) updatedUser.nombre = nombre;
    if (apellido) updatedUser.apellido = apellido;    
    if (email) updatedUser.email = email;
    if (password) updatedUser.password = password;

    return updatedUser;
  } catch (error) {
    const objError = handleError(error, process.env.PATH_FILE_ERROR);
    return objError;
  }
};

export { createUserObject, createUpdateUserObject };