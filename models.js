import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomUUID, createHash } from "node:crypto";
import dotenv from "dotenv";
import { handleError } from "./utils/handleError.js";
import { validateEmail } from "./utils/validateEmail.js";

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


const addUser = (userData) => {
  try {
    // addUser recibe un objeto con toda la data para el nuevo usuario
    const {nombre, apellido, email, password} =  userData;
    
    // valida que esten los datos míminos para añadir un nuevo usuario
    if (!nombre || !apellido || !email || !password) {
      throw new Error("Missing data");
    }
    // Validamos que el nombre, apellido, email sean string
    if ((typeof nombre !== "string") || (typeof apellido !== "string") || (typeof email !== "string")){
      throw new Error("Data not string");
    }

    // Validamos contenido de Email
    if (!validateEmail(email)) {
      throw new Error("Invalid Email");
    }
    
    const users = getUsers(PATH_FILE_USER);

    // No usamos getUserById por que nos devuelve una copia del objeto y no termina de modificarlo nunca
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

const updateUser = (userData) => {
  try {
    const {id, nombre, apellido, email, password} = userData; // Ingresa la data

    if (!id){ // Valida ID existente
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
    if (!validateEmail(email)) {
      throw new Error("Invalid Email");
    }
    
    const users = getUsers(PATH_FILE_USER); // llamada a usuarios
    const user = users.find((user) => user.id === id); // busco id requerido

    if (!user) { // si no hay usuario retorna error
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

    writeFileSync(PATH_FILE_USER, JSON.stringify(users));
    return user;
  } catch (error) {
    const objError = handleError(error, PATH_FILE_ERROR);
    return objError;
  }
};

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


export { getUsers, getUserById, addUser, updateUser, deleteUser, PATH_FILE_USER, PATH_FILE_ERROR};
