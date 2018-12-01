var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');

var usuarioSchema = mongoose.Schema({
    nombre: String,
    apellido: String,
    fechaNac: String,
    pais: String,
    usuario: String,
    password: String
});
var usuario = mongoose.model('usuario', usuarioSchema);
 
var zapatillaSchema = mongoose.Schema({
    nombre: String,
    descripcion: String,
    marca: String,
    precio: Number,
    imagen: String,
    sexo: String,
    talla : Array
});

var zapatilla = mongoose.model('zapatilla', zapatillaSchema);

// Add connection
mongoose.connect('mongodb://localhost/clothesDC', function (err) {
    if (err) {
        console.log('Connection failed');
    }
    else {
        console.log('Connection successful');
    }
});

var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

var router = express.Router();

router.route('/usuario').get(function (req, res) {
    console.log("RESPONSE: " + req);
    usuario.find(function (err, resultado) {
        if (err) {
            res.status(500).json({ mensaje: 'Error al cargar usuario' });
        }
        else {
            res.status(200).json(resultado);
        }
    });
}).post(function (req, res) {
    var myUser = new usuario();
    myUser.nombre = req.body.nombre;
    myUser.apellido = req.body.apellido;
    myUser.fechaNac = req.body.fechaNac;
    myUser.pais = req.body.pais;
    myUser.usuario = req.body.usuario;
    myUser.password = req.body.password;

    myUser.save(function (err, resultado) {
        if (err) {
            res.status(500)
                .json({ mensaje: 'Fallo al usuario registrado' })
        }
        else {
            res.status(200)
                .json({ mensaje: 'Usuario registrado correctamente' });
        }
    });
});

router.route('/zapatilla').get(function (req, res) {
    let marca = req.query.marca;
    if (marca != null) {
        zapatilla.find({ marca: marca }, function (err, resultado) {
            if (err) {
                res.status(500).json({ mensaje: 'Error al cargar las zapatillas' });
            }
            else {
                res.status(200).json(resultado);
            }
        });
    } else {
        zapatilla.find(function (err, resultado){
            if(err) {
                res.status(500).json({ mensaje: 'Error al cargar las zapatillas' });
            } else {
                res.status(200).json(resultado);
            }
        });
    }
}).post(function (req, res) {

    var z = new zapatilla();
    z.nombre = req.body.nombre;
    z.descripcion = req.body.descripcion;
    z.marca = req.body.marca;
    z.precio = req.body.precio;
    z.imagen = req.body.imagen;
    z.sexo = req.body.sexo;
    z.talla = req.body.talla;

    z.save(function (err, resultado) {
        if (err) {
            res.status(500)
                .json({ mensaje: 'Fallo la zapatilla registrado' })
        }
        else {
            res.status(200)
                .json({ mensaje: 'Zapatilla registrada correctamente' });
        }
    });
});

router.route('/login').post(function (req, res) {
    let username = req.query.usuario;
    let password = req.query.password
    usuario.findOne({ usuario: username, password: password }, function (err, resultado) {
        if (err) {
            res.status(500).json({ mensaje: 'Error en el servidor' });
        }
        else {
            if (resultado != null) {
                res.status(200).json(resultado);
            } else {
                res.status(401).json({ mensaje: 'Acceso denegado' });
            }
        }
    });
});

app.use('/api', router);

app.listen(3000);
