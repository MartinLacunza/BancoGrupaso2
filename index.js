const express = require ('express');
const app = express();
require('dotenv').config();
const Port = process.env.PORT || 8080;
const hbs = require('hbs');
const mysql = require('mysql2');
const path = require('path');
const nodemailer = require('nodemailer');
const { log } = require('console');
const { consumers } = require('stream');

//conexion a la base de datos
const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.PORTDB,
    database: process.env.DATABASE,
});



//conectamos la database
const conectar = (
    conexion.connect((error) =>{
        if(error) throw error;
        console.log('Base de Datos Conectada!!');
    })
);



//middlewars

app.use(express.json());
app.use(express.urlencoded({extended: false}));



//configuramos la vista de la aplicacion


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));


app.get('/', (req, res) =>{
    res.render('index')

});

app.get('/formulario', (req, res) =>{
    res.render('formulario')
});



app.post('/formulario', (req, res) =>{
    console.log(req.body);
    const {nombre, apellido, fnac, telefono, correo, documento} = req.body;


    if(nombre == "" || apellido == ""||
    fnac == ""|| telefono == ""|| correo == ""|| documento == ""){
        let validacion = 'Faltan datos para ingresar la consulta'
        res.render('formulario', {
            validacion
        })} else{
        console.log(nombre);
        console.log(apellido);
        console.log(fnac);
        console.log(telefono);
        console.log(correo);
        console.log(documento);
        let data = {
            formulario_nombre: nombre,
            formulario_apellido: apellido,
            formulario_fnac: fnac,
            formulario_correo: correo,
            formulario_telefono: telefono,
            formulario_documento: documento
        };
        
        let sql = "INSERT INTO FORMULARIO SET ?";
        
        let query = conexion.query(sql, data, (err, results) =>{
            if(err) throw err;
            
        });
        res.render('index')
};
});

app.listen(Port, ()=>{
    console.log(`Servidor corriendo en el puerto ${Port}`);
}); 


app.on('error', (error)=>{
    console.log(`Tenemos un error ${error}`);
});