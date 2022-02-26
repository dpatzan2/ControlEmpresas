const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

const fs = require('fs'); 
const Pdfmake = require('pdfmake'); 
//const PDFDocument = require('pdfkit');

//METODO PARA OBTNER TODA LA LISTA DE USUARIOS (ADMINISTRADORES Y EMPRESAS)

function ObtenerUsuarios(req, res) {

    if(req.user.rol == 'Empresa'){
        return res.status(500).send({mensaje: 'No tienes acceso a esta informacion'})
    }else{
        Usuarios.find((err , usuariosObtenidos) => {
            if(err) return res.send({mensaje: "error:" + err})
        
            for (let i = 0; i < usuariosObtenidos.length; i++) {
            console.log(usuariosObtenidos[i].nombre)
            }
        
        return res.send({usuarios: usuariosObtenidos})
    })
    }
} 


//METODO PARA AGREGAR EMPRESAS

function RegistrarEmpresas(req, res){
    var parametros = req.body;
    var usuarioModelo = new Usuarios();

    console.log(parametros.nombre);


    if(req.user.rol == 'Empresa'){
        return res.status(500).send({mensaje: 'No tienes acceso a crear empresas'});
    }else{
        if (parametros.nombre && parametros.descripcionEmpresa && parametros.usuario && parametros.password) {
            usuarioModelo.nombre = parametros.nombre;
            usuarioModelo.descripcionEmpresa = parametros.descripcionEmpresa;
            usuarioModelo.usuario = parametros.usuario;
            usuarioModelo.rol = 'Empresa';   
            usuarioModelo.cantidadEmpleados = 0;
           // if(parametros.rol != 'ROL_ALUMNO' || parametros.rol == '') return res.status(500).send({mensaje: 'No puedes elegir el rol, siempre sera "alumno"'});
            Usuarios.find({usuario: parametros.usuario}, (err, usuarioEcontrado) => {
                if(usuarioEcontrado == 0){
    
                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                        usuarioModelo.password = passwordEncriptada;
    
                        usuarioModelo.save((err, usuarioGuardado) => {
                            if(err) return res.status(500).send({message: 'Error en la peticion'});
                            if(!usuarioGuardado) return res.status(404).send({message: 'No se encontraron usuarios'});
                
                            return res.status(200).send({usuario: usuarioGuardado});
                        });
                    });
                }else{
                    return res.status(500).send({mensaje: 'Este usuario ya esta siendo utilizado, pruebe usando otro'});
                } 
                
            })
        }else{
            return res.status(500).send({mensaje: 'Llene todos los campos requeridos'});
        }
    }
    
}

//METODO PARA PODER AGREGAR ADMINISTRADORES

function RegistrarAdministradores(req, res){
    var parametros = req.body;
    var usuarioModelo = new Usuarios();


    if(req.user.rol == 'Empresa'){
        return res.status(500).send({mensaje: 'No tienes permisos para realizar esta accion'});
    }else{
        if (parametros.nombre && parametros.apellido && parametros.usuario && parametros.password) {
            usuarioModelo.nombre = parametros.nombre;
            usuarioModelo.apellido = parametros.apellido;
            usuarioModelo.usuario = parametros.usuario;
            usuarioModelo.rol = 'ADMIN';   
           // if(parametros.rol != 'ROL_ALUMNO' || parametros.rol == '') return res.status(500).send({mensaje: 'No puedes elegir el rol, siempre sera "alumno"'});
            Usuarios.find({usuario: parametros.usuario}, (err, usuarioEcontrado) => {
                if(usuarioEcontrado == 0){
    
                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                        usuarioModelo.password = passwordEncriptada;
    
                        usuarioModelo.save((err, usuarioGuardado) => {
                            if(err) return res.status(500).send({message: 'Error en la peticion'});
                            if(!usuarioGuardado) return res.status(404).send({message: 'No se encontraron usuarios'});
                
                            return res.status(200).send({usuario: usuarioGuardado});
                        });
                    });
                }else{
                    return res.status(500).send({mensaje: 'Este usuario ya esta siendo utilizado, pruebe usando otro'});
                } 
                
            })
        }
    }
}


//METODO PARA PODER INICIAR SESION
function Login(req, res) {
    var parametros = req.body;

    Usuarios.findOne({usuario: parametros.usuario}, (err, usuarioEcontrado) =>{
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(usuarioEcontrado){
            //COMPARO CONTRASEÑA SIN ENCRIPTAR CON LA ENCRIPTADA
            bcrypt.compare(parametros.password, usuarioEcontrado.password, (err, verificacionPassword)=>{
                //VERIFICAR SI EL PASSWORD COINCIDE EN LA BASE DE DATOS
                if(verificacionPassword){

                    //SI EL PARAMETRO OBTENERTOKEN ES TRUE, CREA EL TOKEN
                    if(parametros.obtenerToken === 'true'){
                        return res.status(500).send({token: jwt.crearToken(usuarioEcontrado)});
                    }else{
                        usuarioEcontrado.password = undefined;
                        return res.status(200).send({usuario: usuarioEcontrado});
                    }
                }else{
                    return res.status(500).send({message: 'la contraseña no coincide'});
                }
            });

        }else{
            return res.status(500).send({mensaje: 'El correo no se encuentra registrado'});
        }
    });
}

//METODO PARA PODER MODIFICAR USUARIOS (ADMNISTRADORES Y EMPRESAS)

function EditarUsuarios(req, res) {
    var idUsu = req.params.idUsuario;
    var parametros = req.body;

   if(req.user.rol == 'Empresa'){
    if(idUsu !== req.user.sub) return res.status(500).send({mensaje: 'No tiene permitido editar otras empresas'});
    Usuarios.findByIdAndUpdate(idUsu, parametros, {new: true}, (err, usuarioActualizado) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!usuarioActualizado) return res.status(404).send({message: 'No se encontraron usuarios'});

        return res.status(200).send({empresa: usuarioActualizado});
    });

   }else{
    Usuarios.findByIdAndUpdate(idUsu, parametros, {new: true}, (err, usuarioActualizado) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!usuarioActualizado) return res.status(404).send({message: 'No se encontraron usuarios'});

        return res.status(200).send({usuarios: usuarioActualizado});
    });
   }
}


//METODO PARA ELIMINAR USUARIOS (ADMINISTRADORES Y EMPRESAS)
function EliminarUsuarios(req, res) {
    var idUsu = req.params.idUsuario;

    if(req.user.rol == 'Empresa'){
        if(idUsu !== req.user.sub) return res.status(500).send({mensaje: 'No tiene permitido eliminar otras empresas'});
        Usuarios.findByIdAndDelete(idUsu, {new: true}, (err, usuarioEliminado) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!usuarioEliminado) return res.status(404).send({message: 'No se encontraron usuarios'});

        return res.status(200).send({empresa: usuarioEliminado});
    })
    }else if(req.user.rol == 'ADMIN'){
        Usuarios.findByIdAndDelete(idUsu, {new: true}, (err, usuarioEliminado) => {
            if(err) return res.status(500).send({message: 'Error en la peticion'});
            if(!usuarioEliminado) return res.status(404).send({message: 'No se encontraron usuarios'});
    
            return res.status(200).send({usuarios: usuarioEliminado});
        })
    }else{
        return res.status(500).send({mensaje: 'Ocurrio un error, intentelo mas tarde'})
    }

    
}

//METODO PARA FILTRAR POR NOMBRE

function BuscarUsuarios(req, res) {
    var busqueda = req.params.dBusqueda;

    Usuarios.find({nombre: {$regex: busqueda, $options: 'i'}}, (err, usuarioEcontrado) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!usuarioEcontrado) return res.status(404).send({message: 'No se encontraron usuarios'});

        return res.status(200).send({usuarios: usuarioEcontrado});
    })

    
}

//METODO PARA BUSCAR POR APELLIDO

function BuscarUsuariosA(req, res) {
    var busqueda = req.params.dBusqueda;

    Usuarios.find({apellido: {$regex: busqueda, $options: 'i'}}, (err, usuarioEcontrado) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!usuarioEcontrado) return res.status(404).send({message: 'No se encontraron usuarios'});

        return res.status(200).send({usuarios: usuarioEcontrado});
    })

    
}


//METODO PARA BUSCAR POR ROL
function BuscarUsuariosR(req, res) {
    var busqueda = req.params.dBusqueda;

    Usuarios.find({rol: {$regex: busqueda, $options: 'i'}}, (err, usuarioEcontrado) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!usuarioEcontrado) return res.status(404).send({message: 'No se encontraron usuarios'});

        return res.status(200).send({usuarios: usuarioEcontrado});
    })

    
}

//METODO PARA BUSCAR POR NOMBRE
function BuscarUsuariosId(req, res){
    var idUsu = req.params.idUsuario;

    Usuarios.findById(idUsu, (err, usuarioEcontrado) => {

        if(err) return res.status(500).send({mensaje: 'error en la peticion'});
        if(!usuarioEcontrado) return res.status(404).send({mensaje: 'Error al obtener los datos'});

        return res.status(200).send({usuarios: usuarioEcontrado});
    })
}

module.exports = {
    ObtenerUsuarios,
    RegistrarEmpresas,
    RegistrarAdministradores,
    EditarUsuarios,
    EliminarUsuarios,
    BuscarUsuarios,
    BuscarUsuariosA,
    BuscarUsuariosR,
    BuscarUsuariosId,
    Login,
}