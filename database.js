const inquirer = require("inquirer");
const fs = require("fs");
const db = JSON.parse(fs.readFileSync("./users.json", "utf8"));
inquirer.prompt([
    {
        type: 'list',
        name: 'action',
        message: 'Que deseas hacer?',
        choices: ['Buscar', 'Añadir', 'Eliminar'],
        filter(val) {
          return val.toLowerCase();
        },
      },
      {
        type: 'input',
        name: 'user',
        message: 'Cual es el user?',
      }
]).then(function(answers) {
    console.log(answers);
    if (answers.action === 'buscar') {
    const dbdata = db.find(x => x.username === answers.user);
    if (dbdata) {
    console.log(dbdata);
    } else {
    console.log('No existe el usuario');

    }}
    if (answers.action === 'añadir') {
    constant = {
        username : answers.user,
        reason : "normal"
      }
      db.push(constant);
      fs.writeFileSync('users.json', JSON.stringify(db));
        console.log('Usuario añadido');
    }
    if (answers.action === 'eliminar') {
    const dbdata = db.find(x => x.username === answers.user);
    if (dbdata) {
    db.splice(db.indexOf(dbdata), 1);
    fs.writeFileSync('users.json', JSON.stringify(db));
    console.log('Usuario eliminado');
    }}
    
})