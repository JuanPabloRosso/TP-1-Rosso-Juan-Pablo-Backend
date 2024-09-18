import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomUUID, createHash } from "node:crypto";
import dotenv from "dotenv";
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

// const resp = getUserById("897796d9-77a5-4d06-84f6-9fd9cc6ec045");
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

// const obj = {
//   "nombre": "Emma",
//   "apellido":"Issac",
//   "email":"EmmaIssac@gmail.com",
//   "password":"1212"
// }

// const resp = addUser(obj);
// console.log(resp);



const updateUser = (userData) => {
  try {
    const {id, nombre, apellido, email, password} = userData; // Ingresa la data

    if (!id){ // Valida data existente + id
      throw new Error("ID is missing");
    }

    // Valido que todos los campos esten completos
    if (!nombre || !apellido || !email || !password) {
      throw new Error("Missing data");
    }
    // Valido que sean tring
    if ((typeof nombre !== "string") || (typeof apellido !== "string") || (typeof email !== "string")) {
      throw new Error("Data not string");
    }

    // Validamos contenido de Email
    if (!email.includes("@")) {
      throw new Error("Invalid Email");
    }
    const users = getUsers(PATH_FILE_USER); // llamada a usuarios
    const user = users.find((user) => user.id === id); // busco id requerido

    if (!user) { // si  no hay usuario retorna error
      throw new Error("User not found");
    }

    const filteredUsers = users.filter((user) => user.id !== id); // Filtro usuarios para comparar email
    const foundEmail = filteredUsers.find((user) => user.email === email); // Verifico que no exista el email en los demas usuarios

    if (foundEmail) {
      throw new Error("Email already exists. Try another email"); // Si el email ya existe retorno error
    }

    // hashea la contraseña antes de registrar al usuario
    const hash = createHash("sha256").update(password).digest("hex");

    if (nombre) user.nombre = nombre;
    if (apellido) user.apellido = apellido;
    if (email) user.email = email;
    if (password) user.password = hash;

    user.isLoggedIn = false;

    writeFileSync(PATH_FILE_USER, JSON.stringify(users));
    return user;
  } catch (error) {
    const objError = handleError(error, PATH_FILE_ERROR);
    return objError;
  }
};

// const obj = {
//     "id":"897796d9-77a5-4d06-84f6-9fd9cc6ec045",
//     "nombre":"Juan-Pablo",
//     "apellido":"Rosso",
//     "email":"juanpablorosso@gmail.com",
//     "password":"3455"
//   }  

// console.log(updateUser(obj));

const deleteUser = (id) => {
  try {
    if (!id) {
      throw new Error("ID is missing");
    }

    const users = getUsers(PATH_FILE_USER);
    const userDelete = getUserById(id);

    const filteredUsers = users.filter((user) => user.id !== id);

    writeFileSync(PATH_FILE_USER, JSON.stringify(filteredUsers));
    return userDelete;
  } catch (error) {
    const objError = handleError(error, PATH_FILE_ERROR);
    return objError;
  }
};

// console.log(deleteUser("897796d9-77a5-4d06-84f6-9fd9cc6ec047"));

export { getUsers, getUserById, addUser, updateUser, deleteUser};
