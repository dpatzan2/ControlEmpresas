const express = require('express');
const empleadoController = require('../Controllers/empleados.controller');
const md_autenticacion = require('../middlewares/autenticacion');


var api = express.Router();



//CONSULTAS PARA BUSCAR POR NOMBRE, PUESTO, DEPARTAMENTO Y MOSTRAR TODOS LOS EMPLEADOS DE LA EMPRESA
api.get('/empleados', md_autenticacion.Auth, empleadoController.obtenerEmpleadosPorEmpresa);
api.get('/empleados/buscarNombre/:dBusqueda', md_autenticacion.Auth, empleadoController.BuscarEmpleadosNombre);
api.get('/empleados/buscarPuesto/:dBusqueda', md_autenticacion.Auth, empleadoController.BuscarEmpleadosPuesto);
api.get('/empleados/buscarDepartamento/:dBusqueda', md_autenticacion.Auth, empleadoController.BuscarEmpleadosDepartamento);
api.get('/empleados/buscarId/:dBusqueda', md_autenticacion.Auth, empleadoController.BuscarEmpleadosId);

//CONTAR CANTIDAD DE EMPLEADOS DE CADA EMPRESA
api.get('/empleados/cantidad', md_autenticacion.Auth, empleadoController.cantidadEmpleados);

//AGREGAR EMPLEADOS A UNA EMPRESA
api.post('/empleados/agregar', md_autenticacion.Auth, empleadoController.agregarEmpleados);

//MODIFICAR LOS DATOS DE UN EMPLEADO
api.put('/empleados/editar/:idEmpleado', md_autenticacion.Auth, empleadoController.editarEmpleado);

//ELIMINAR UN EMPLEADO
api.delete('/empleados/eliminar/:idEmpleado', md_autenticacion.Auth, empleadoController.eliminarEmpleados);

//GENERAR PDF
api.get('/empleados/generarPDF', md_autenticacion.Auth, empleadoController.generarPDF);


module.exports = api;