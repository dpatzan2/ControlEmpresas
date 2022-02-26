const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UsuariosSchema = Schema({ 
    nombre: String,
    apellido: String,
    descripcionEmpresa: String,
    password: String,
    rol: String,
    usuario: String,
    cantidadEmpleados: Number
});

module.exports = mongoose.model('Usuarios', UsuariosSchema);