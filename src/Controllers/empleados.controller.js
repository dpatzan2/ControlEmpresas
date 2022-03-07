const Empleados = require('../models/empleados.model');
const Usuarios = require('../models/usuarios.model');

const fs = require('fs'); 
const Pdfmake = require('pdfmake'); 

const xl = require('excel4node');

const PdfkitConstruct = require('pdfkit-construct');

const path = require('path');

 
//METODO PARA OBTENER TODOS LOS EMPLEADOS DE UNA EMPRESA

function obtenerEmpleadosPorEmpresa(req, res) {
    var parametros = req.body;
    //SI EL ADMINISTRADOR QUIERE OBTNER EL LISTADO DE EMPLEADOS DE LA EMPRESA DEBE ESPECIFIARLO POR EL BODY
    if(req.user.rol == 'ADMIN'){
        Empleados.find({idEmpresa: parametros.idEmpresa}, (err, empleadosEncontrados) => {
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!empleadosEncontrados) return res.status(404).send({mensaje: 'Error al obtener a sus empleaods'});
    
            return res.status(200).send({Sus_empleados: empleadosEncontrados});
        }).populate('idEmpresa', 'nombre descripcionEmpresa');
    //SI EL EMPLEADO QUIERE OBTNER LOS EMPLEADOS DE SU EMPRESA, SE TOMARA EL ID DEL TOKEN PARA HACER LA CONSULTA
    }else{
    Empleados.find({idEmpresa: req.user.sub}, (err, empleadosEncontrados) => {
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!empleadosEncontrados) return res.status(404).send({mensaje: 'Error al obtener a sus empleaods'});

        return res.status(200).send({Sus_empleados: empleadosEncontrados});
    }).populate('idEmpresa', 'nombre descripcionEmpresa');
    }
}

//METODO PARA OBTENER LOS EMPLEADOS POR NOMBRE

function BuscarEmpleadosNombre(req, res) {
    var busqueda = req.params.dBusqueda;
    var parametros = req.body;

    //SI EL ADMINISTRADOR ES EL QUE DESEA BUSCAR DEBERA ESPECIFICAR EL ID DE LA EMPRESA POR EL BODY PARA LA BUSQUEDA
    if(req.user.rol == 'ADMIN'){
        Empleados.find({nombre: {$regex: busqueda, $options: 'i'}, idEmpresa: parametros.idEmpresa}, (err, usuarioEcontrado) => {
            if(err) return res.status(500).send({message: 'Error en la peticion'});
            if(!usuarioEcontrado) return res.status(404).send({message: 'No se encontraron usuarios'});
    
            return res.status(200).send({usuarios: usuarioEcontrado});
        }).populate('idEmpresa', 'nombre descripcionEmpresa');
    //SI UNA EMPRESA QUIERE BUSCAR UN EMPLEADO EL ID DE LA EMPRESA SE TOMARA DEL TOKEN
    }else{
        Empleados.find({nombre: {$regex: busqueda, $options: 'i'}, idEmpresa: req.user.sub}, (err, usuarioEcontrado) => {
            if(err) return res.status(500).send({message: 'Error en la peticion'});
            if(!usuarioEcontrado) return res.status(404).send({message: 'No se encontraron usuarios'});
    
            return res.status(200).send({usuarios: usuarioEcontrado});
        }).populate('idEmpresa', 'nombre descripcionEmpresa');
    }
    
}

//METODO PARA OBTENER LOS EMPLEADOS POR PUESTO

function BuscarEmpleadosPuesto(req, res) {
    var busqueda = req.params.dBusqueda;
    var parametros = req.body;

    //SI EL ADMINISTRADOR ES EL QUE DESEA BUSCAR DEBERA ESPECIFICAR EL ID DE LA EMPRESA POR EL BODY PARA LA BUSQUEDA
    if(req.user.rol == 'ADMIN'){
        Empleados.find({puesto: {$regex: busqueda, $options: 'i'}, idEmpresa: parametros.idEmpresa}, (err, usuarioEcontrado) => {
            if(err) return res.status(500).send({message: 'Error en la peticion'});
            if(!usuarioEcontrado) return res.status(404).send({message: 'No se encontraron usuarios'});
    
            return res.status(200).send({usuarios: usuarioEcontrado});
        }).populate('idEmpresa', 'nombre descripcionEmpresa');
    //SI UNA EMPRESA QUIERE BUSCAR UN EMPLEADO EL ID DE LA EMPRESA SE TOMARA DEL TOKEN
    }else{
        Empleados.find({puesto: {$regex: busqueda, $options: 'i'}, idEmpresa: req.user.sub}, (err, usuarioEcontrado) => {
            if(err) return res.status(500).send({message: 'Error en la peticion'});
            if(!usuarioEcontrado) return res.status(404).send({message: 'No se encontraron usuarios'});
    
            return res.status(200).send({usuarios: usuarioEcontrado});
        }).populate('idEmpresa', 'nombre descripcionEmpresa');
    }
}

//METODO PARA OBTENER LOS EMPLEADOS POR DEPARTAMENTO

function BuscarEmpleadosDepartamento(req, res) {
    var busqueda = req.params.dBusqueda;
    var parametros = req.body;

    //SI EL ADMINISTRADOR ES EL QUE DESEA BUSCAR DEBERA ESPECIFICAR EL ID DE LA EMPRESA POR EL BODY PARA LA BUSQUEDA
    if(req.user.rol == 'ADMIN'){
        Empleados.find({departamento: {$regex: busqueda, $options: 'i'}, idEmpresa: parametros.idEmpresa}, (err, usuarioEcontrado) => {
            if(err) return res.status(500).send({message: 'Error en la peticion'});
            if(!usuarioEcontrado) return res.status(404).send({message: 'No se encontraron usuarios'});
    
            return res.status(200).send({usuarios: usuarioEcontrado});
        }).populate('idEmpresa', 'nombre descripcionEmpresa');
    //SI UNA EMPRESA QUIERE BUSCAR UN EMPLEADO EL ID DE LA EMPRESA SE TOMARA DEL TOKEN
    }else{
        Empleados.find({departamento: {$regex: busqueda, $options: 'i'}, idEmpresa: req.user.sub}, (err, usuarioEcontrado) => {
            if(err) return res.status(500).send({message: 'Error en la peticion'});
            if(!usuarioEcontrado) return res.status(404).send({message: 'No se encontraron usuarios'});
    
            return res.status(200).send({usuarios: usuarioEcontrado});
        }).populate('idEmpresa', 'nombre descripcionEmpresa');
    }
}

//METODO PARA OBTENER LOS EMPLEADOS POR ID

function BuscarEmpleadosId(req, res) {
    var busqueda = req.params.dBusqueda;
    var parametros = req.body;

    //SI EL QUE DESEA BUSCAR ES EL ADMINISTRADOR SE DEBE ESPECIFICAR EL ID DE LA EMPRESA PARA PODER BUSCAR AL EMPLEADO
    if(req.user.rol == 'ADMIN'){
        Empleados.findOne({_id: busqueda, idEmpresa: parametros.idEmpresa}, (err, usuarioEcontrado) => {
            if(err) return res.status(500).send({message: 'Error en la peticion'});
            if(!usuarioEcontrado) return res.status(404).send({message: 'Estos datos no pertenecen a tu empresa'});
    
            return res.status(200).send({usuarios: usuarioEcontrado});
        }).populate('idEmpresa', 'nombre descripcionEmpresa');
    //SI EL QUE DESEA BUSCAR ES UNA EMPRESA SE TOMARA DE SU TOKEN SU ID PARA PODER BUSCAR EL EMPLEADO
    }else{
    Empleados.findOne({_id: busqueda, idEmpresa: req.user.sub}, (err, usuarioEcontrado) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!usuarioEcontrado) return res.status(404).send({message: 'Estos datos no pertenecen a tu empresa'});

        return res.status(200).send({usuarios: usuarioEcontrado});
    }).populate('idEmpresa', 'nombre descripcionEmpresa');
    }
}

//CONTAR LA CANTIDAD DE EMPLEADOS DE DETERMINADA EMPRESA

function cantidadEmpleados(req, res) {
    var parametros = req.body;
    //SI EL QUE QUIERE BUSCAR ADMIN DEBE ESPECIFICAR EL ID DE LA EMPRESA POR EL BODY
    if(req.user.rol == 'ADMIN'){
        Empleados.find({idEmpresa: parametros.idEmpresa}, (err, cantidadEmpleados) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if(!cantidadEmpleados) return res.status(500).send({ mensaje: 'no se encontraro empleados'})
    
            return res.status(200).send({cantidad_empleados: cantidadEmpleados.length});
        })
    //SI ES EMPRESA EL QUE QUIERE SABER LA CANTIDAD DE SUS EMPLEADOS, SE TOMARA DEL TOKEN SU ID
    }else{
        Empleados.find({idEmpresa: req.user.sub}, (err, cantidadEmpleados) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if(!cantidadEmpleados) return res.status(500).send({ mensaje: 'no se encontraro empleados'})
    
            return res.status(200).send({cantidad_empleados: cantidadEmpleados.length});
        })
    }
    
}

//METODO PARA AGREGAR A EMPLEADOS A UNA EMPRESA

function agregarEmpleados(req, res){
    var parametros = req.body;
    var empleadosModel = new Empleados();
    var usuarioModelo = new Usuarios();
        if(parametros.nombre && parametros.apellido && parametros.puesto && parametros.departamento){
            empleadosModel.nombre = parametros.nombre;
            empleadosModel.apellido = parametros.apellido;
            if(req.user.rol == 'ADMIN'){
                empleadosModel.idEmpresa = parametros.idEmpresa;
            }else if(req.user.rol == 'Empresa'){
                empleadosModel.idEmpresa = req.user.sub;
            }
            empleadosModel.puesto = parametros.puesto;
            empleadosModel.departamento = parametros.departamento;

                if(req.user.rol == 'ADMIN' && !parametros.idEmpresa){
                    return res.status(500).send({ mensaje: "El administrador debe especificar el id de la empresa para agregar el empleado"});
                }else{
                empleadosModel.save((err, empleadoGuardado) => {
                    if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
                    if(!empleadoGuardado) return res.status(500).send({ mensaje: "Error al guardar al empleado"});

                    Empleados.find({idEmpresa: req.user.sub}, (err, cantidadEmpleados) => {
                        if(err) return res.status(500).send({ mensaje: "Error en la peticion" })
                        if(!cantidadEmpleados) return res.status(500).send({ mensaje: 'no se encontraro empleados'})

                        Usuarios.findByIdAndUpdate({_id: req.user.sub}, {cantidadEmpleados: cantidadEmpleados.length}, (err, actualizarEmpleados) => {
                            if(err) return res.status(500).send({ mensaje: "Error en la peticion" })
                            if(!actualizarEmpleados) return res.status(500).send({ mensaje: 'no se actualizar la cantidad'})
    
                        })
                    })
                    return res.status(200).send({ empleado: empleadoGuardado });
                });
            }
        } else{
            return res.status(500).send({ mensaje: "Debe rellenar los campos necesarios." });
        }
}

//METODO PARA EDITAR A LOS EMPLEADOS DE UNA DETERMINADA EMPRESA

function editarEmpleado(req, res) {
    var idEm = req.params.idEmpleado;
    var parametros = req.body;
    if(req.user.rol == 'ADMIN'){
        Empleados.findOneAndUpdate({ _id: idEm},parametros,{ new: true },(error, empleadoEditado) => {
            if (error) return res.status(500).send({ Error: "Error en la peticion" });
            if (!empleadoEditado) return res.status(500).send({ Mensaje: "Esta empresa no es tuya, no lo puedes modificar" });
    
            return res.status(200).send({ empleado: empleadoEditado });
        });
    }else if(req.user.rol == 'Empresa'){
        Empleados.findOneAndUpdate({ _id: idEm, idEmpresa: req.user.sub },parametros,{ new: true },(error, empleadoEditado) => {
            if (error) return res.status(500).send({ Error: "Error en la peticion" });
            if (!empleadoEditado) return res.status(500).send({ Mensaje: "Esta empresa no es tuya, no lo puedes modificar" });
    
            return res.status(200).send({ empleado: empleadoEditado });
        });
    }
    
    
}

//METODO PARA ELIMINAR EMPLEADOS DE UNA DETERMINADA EMPRESA

function eliminarEmpleados(req, res) {
    var idEm = req.params.idEmpleado;

    if(req.user.rol == 'ADMIN'){
        Empleados.findOneAndDelete({ _id: idEm}, {new: true}, (err, empleadoEliminado) => {
            if(err) return res.status(500).send({message: 'Error en la peticion'});
            if(!empleadoEliminado) return res.status(404).send({message: 'Esta empresa no es tuya, no la puedes modificar'});
    
            Empleados.find({idEmpresa: req.user.sub}, (err, cantidadEmpleados) => {
                if(err) return res.status(500).send({ mensaje: "Error en la peticion" })
                if(!cantidadEmpleados) return res.status(500).send({ mensaje: 'no se encontraro empleados'})
    
                Usuarios.findByIdAndUpdate({_id: req.user.sub}, {cantidadEmpleados: cantidadEmpleados.length}, (err, actualizarEmpleados) => {
                    if(err) return res.status(500).send({ mensaje: "Error en la peticion" })
                    if(!actualizarEmpleados) return res.status(500).send({ mensaje: 'no se actualizar la cantidad'})
    
                })
            })
    
            return res.status(200).send({empleado: empleadoEliminado});
        }) 
    }else if(req.user.rol == 'Empresa'){
        Empleados.findOneAndDelete({ _id: idEm, idEmpresa: req.user.sub }, {new: true}, (err, empleadoEliminado) => {
            if(err) return res.status(500).send({message: 'Error en la peticion'});
            if(!empleadoEliminado) return res.status(404).send({message: 'Esta empresa no es tuya, no la puedes modificar'});
    
            Empleados.find({idEmpresa: req.user.sub}, (err, cantidadEmpleados) => {
                if(err) return res.status(500).send({ mensaje: "Error en la peticion" })
                if(!cantidadEmpleados) return res.status(500).send({ mensaje: 'no se encontraro empleados'})
    
                Usuarios.findByIdAndUpdate({_id: req.user.sub}, {cantidadEmpleados: cantidadEmpleados.length}, (err, actualizarEmpleados) => {
                    if(err) return res.status(500).send({ mensaje: "Error en la peticion" })
                    if(!actualizarEmpleados) return res.status(500).send({ mensaje: 'no se actualizar la cantidad'})
    
                })
            })
    
            return res.status(200).send({empleado: empleadoEliminado});
        }) 
    }

    
    
}

//METODO PARA GENERAR UN PDF CON EL LISTADO DE LOS EMPLEADOS DE UNA DETERMINADA EMPRESA

function obtenerID(req, res){
    var logueado;
    var parametros = req.body;
    if(req.user.rol == 'ADMIN'){
        if(parametros.idEmpresa){
            Empleados.find({idEmpresa: parametros.idEmpresa}, (err, empleadoEncontrado) => { 
                if(err) return res.status(500) .send({ mensaje: 'Error en la peticion' }); 

                logueado = 'DatosEmpresaDesdeAdmin';
                for (let i = 0; i < empleadoEncontrado.length ; i++) { 
                    obtenerPDF(empleadoEncontrado, logueado);
                } 
            }) 
        }else{
            return res.status(500).send({mensaje: 'Coloque el id de la empresa para generar el pdf'});
        }
    }else{
        Empleados.find({idEmpresa: req.user.sub}, (err, empleadoEncontrado) => { 
            if(err) return res.status(500) .send({ mensaje: 'Error en la peticion' }); 

            logueado = req.user.nombre;
            for (let i = 0; i < empleadoEncontrado.length ; i++) { 
                obtenerPDF(empleadoEncontrado, logueado);
            } 
        }) 
    }
    
    
}

function obtenerPDF(empleadoEncontrado, logueado)  {
    let contador = 0;
    const doc = new PdfkitConstruct({
        bufferPages: true,
    });

    doc.setDocumentHeader({}, () => {


        doc.lineJoin('miter')
            .rect(0, 0, doc.page.width, doc.header.options.heightNumber).fill("#ededed");

        doc.fill("#115dc8")
            .fontSize(20)
            .text("Lista de empleados de: \n" + logueado + '\n', doc.header.x, doc.header.y);
    });
    for (let i = 0; i < empleadoEncontrado.length; i++) {
        contador++;
        doc.text('\n Empleado '+contador+ 
        ' \n ID Empleado: '+ empleadoEncontrado[i].id+
        ' \n Nombre: '+empleadoEncontrado[i].nombre+' '+empleadoEncontrado[i].apellido+
        ' \n Puesto: '+empleadoEncontrado[i].puesto+
        ' \n Departamento: '+empleadoEncontrado[i].departamento);
    }

    doc.text('\n Total de empleados en la empresa ' + empleadoEncontrado.length)
    doc.render();
    doc.pipe(fs.createWriteStream('pdfs/'+ logueado+ '-empleados'+'.pdf'));
    doc.end();
}

/*function generarPDF(empleadoEncontrado, logueado) {
    //var logueado = req.user.sub;
    let contador = 0;
    var fonts = { 
        Roboto: { 
            normal:'./fonts/Roboto/Roboto-Regular.ttf', 
            bold: './fonts/Roboto/Roboto-Medium.ttf', 
            italics: './fonts/Roboto/Roboto-Italic.ttf', 
            bolditalics: './fonts/Roboto/Roboto-MediumItalic.ttf' } 
            }; 
            let pdfmake = new Pdfmake(fonts); 
            let content = [{
                text: "Lista de empleados de: \n" + logueado + '\n',
                alignment: 'center',
                fontSize: 40,
                color: '#e60000',
                
            }]
            for (let i = 0; i < empleadoEncontrado.length; i++) {
                contador++;
                content.push({
                    text: '\n Empleado '+contador+
                    ': \n \t Nombre: '+empleadoEncontrado[i].nombre+' '+empleadoEncontrado[i].apellido+
                    ' \n \t Puesto: '+empleadoEncontrado[i].puesto+
                    ' \n \t Departamento: '+empleadoEncontrado[i].departamento,

                })
            }
            

            content.push({
                text: '\n Total de empleados en la empresa ' + empleadoEncontrado.length 
                
            })
                
        let docDefination = { 
            content: content
        }

        
        let pdfDoc = pdfmake.createPdfKitDocument(docDefination, {});
        pdfDoc.pipe(fs.createWriteStream('pdfs/'+ logueado+ '-empleados'+'.pdf'));
        pdfDoc.end();
}*/

function obtenerIDParaExcel(req, res){
    var logueado;
    var parametros = req.body;
    if(req.user.rol == 'ADMIN'){
        if(parametros.idEmpresa){
            Empleados.find({idEmpresa: parametros.idEmpresa}, (err, empleadoEncontrado) => { 
                if(err) return res.status(500) .send({ mensaje: 'Error en la peticion' }); 

                logueado = 'DatosEmpresaDesdeAdmin';
                for (let i = 0; i < empleadoEncontrado.length ; i++) { 
                    generarExcel(empleadoEncontrado, logueado);
                } 
            }) 
        }else{
            return res.status(500).send({mensaje: 'Coloque el id de la empresa para generar el pdf'});
        }
    }else{
        Empleados.find({idEmpresa: req.user.sub}, (err, empleadoEncontrado) => { 
            if(err) return res.status(500) .send({ mensaje: 'Error en la peticion' }); 

            logueado = req.user.nombre;
            for (let i = 0; i < empleadoEncontrado.length ; i++) { 
                generarExcel(empleadoEncontrado, logueado);
            } 
        }) 
    }
    
    
}


function generarExcel(empleadoEncontrado, logueado){
    var ContadorColumna = 4;

    var wb =  new xl.Workbook();
    var ws = wb.addWorksheet('Empleados');
    var style = wb.createStyle({
        font: {
            bold: true,
            color: '#000000',
            //fillColor: '#7BC5FA', 
            size: 12,
        }
    });

    var greenS = wb.createStyle({
        font: {
            bold: true,
            color: '#ffffff',
            size: 12,
        },
        fill: {
            type: 'pattern', 
            patternType: 'solid', 
            fgColor: '#49cc25' 
        }
    });

    ws.cell(1, 1).string('Empleados de ' + logueado);
    ws.cell(2, 1).string('Empleados total ' + empleadoEncontrado.length);
    ws.cell(4, 1).string('ID empleado').style(greenS);
    ws.cell(4, 2).string('Empleado').style(greenS);
    ws.cell(4, 3).string('Puesto').style(greenS);
    ws.cell(4, 4).string('Departamento').style(greenS);
    for(let i = 0; i < empleadoEncontrado.length ; i++){
        ContadorColumna++;
        ws.cell(ContadorColumna, 1).string(empleadoEncontrado[i].id).style(style);
        ws.cell(ContadorColumna, 2).string(empleadoEncontrado[i].nombre + ' ' + empleadoEncontrado[i].apellido ).style(style);
        ws.cell(ContadorColumna, 3).string(empleadoEncontrado[i].puesto ).style(style);
        ws.cell(ContadorColumna, 4).string(empleadoEncontrado[i].departamento ).style(style);
    }

    

   const pathExcel = path.join(__dirname, '../../Excel', logueado+ '-empleados'+'.xlsx');

    wb.write(pathExcel,function(err, stats){
        if(err){
            console.log('err');
        }else{
            function downloadFile(){
                //res.download(pathExcel);
            }
            downloadFile();
            return false
        }
    })
}






module.exports = {
    obtenerEmpleadosPorEmpresa,
    BuscarEmpleadosNombre,
    BuscarEmpleadosPuesto,
    BuscarEmpleadosDepartamento,
    BuscarEmpleadosId,
    agregarEmpleados,
    editarEmpleado,
    eliminarEmpleados,
    cantidadEmpleados,
    obtenerID,
    obtenerIDParaExcel,
}