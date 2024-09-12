import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomUUID, createHash } from "node:crypto";
import dotenv from "dotenv";
// Averiguar que importar de NODE para realizar el hash del pas
import { handleError } from "./utils/handleError.js";

// 1° recuperar variables de entorno
dotenv.config();
const PATH_FILE_USER=process.env.PATH_FILE_USER;
const PATH_FILE_ERROR=process.env.PATH_FILE_ERROR;

// 2° Declarar los metodos

const getUsers = (urlfile) => {
  try {
    if (!urlfile) {
      throw new Error("Access denied")
    }

    const exists = existsSync(urlfile);

    if (!exists) {
      writeFileSync(urlfile, JSON.stringify([]));
      return [];
    }

    const users = JSON.parse(readFileSync(urlfile));
    return users;

  } catch (error) {
    const objError = handleError(error, PATH_FILE_ERROR);
    return objError;
  }
};

// const resp = getUsers(PATH_FILE_USER);
// console.log(resp);

const getUserById = (id) => {
  try {
    if (!id) {
      throw new Error("ID is missing");
    }
    
    const users = getUsers(PATH_FILE_USER);
    const user = users.find((user) => user.id === id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    const objError = handleError(error, PATH_FILE_ERROR);
    return objError;
  }
};

// const resp = getUserById("1");
// console.log(resp);





const addUser = (userData) => {
  try {
    // addUser recibe un objeto con toda la data para el nuevo usuario
    const {nombre, apellido, email, password} =  userData;
    
    // valida que esten los datos míminos para añadir un nuevo usuario
    if (!nombre || !apellido || !email || !password) { // es un OR que significa O ||
      throw new Error("Missing data");
    }
    // Validamos que el nombre, apellido, email sean string
    if ((typeof nombre !== "string") || (typeof apellido !== "string") || (typeof email !== "string")){
      throw new Error("Data not string");
    }

    // Validamos contenido de Email
    if (!email.includes("@")) {
      throw new Error("Invalid Email");
    }

    const users = getUsers(PATH_FILE_USER);

    const findEmail = users.find((user) => user.email === email);

    if (findEmail) {
      throw new Error("Email already exists");
    }

    // hashea la contraseña antes de registrar al usuario
    const hash = createHash("sha256").update(password).digest("hex")
    
    const newUser = 
      {
        id: randomUUID(),
        nombre,
        apellido,
        email,
        password: hash,
        isLoggedIn: false
    }
    
    users.push(newUser);

    writeFileSync(PATH_FILE_USER, JSON.stringify(users));
    return newUser;

  } catch (error) {
    const objError = handleError(error, PATH_FILE_ERROR);
    return objError;
  }
};

const obj = {
  nombre: "dddd",
  apellido:"Rossodsds",
  email:"juanpablorosso22@gmail.com",
  password:"xxxx"
}

const resp = addUser(obj);
console.log(resp);

// todos los datos del usuario seleccionado se podrían modificar menos el ID
// si se modifica la pass debería ser nuevamente hasheada
// si se modifica el email, validar que este no exista
const updateUser = (userData) => {
  try {
  } catch (error) {}
};

const deleteUser = (id) => {
  try {
  } catch (error) {}
};

export { getUsers, getUserById, addUser, updateUser, deleteUser };
