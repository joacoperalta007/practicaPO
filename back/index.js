var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

const session = require('express-session');

const { realizarQuery } = require('./modulos/mysql');
const { Socket } = require('socket.io');

var app = express();
var port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
}));

app.use(express.static('front/public'));

const server = app.listen(port, () => {
    console.log(`Servidor NodeJS corriendo en http://localhost:${port}/`);
});

const io = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

const sessionMiddleware = session({
    secret: "grupo14xd",
    resave: false,
    saveUninitialized: false
});

app.use(sessionMiddleware);

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

//funciona
app.post('/login', async function login(req, res) {
    console.log(req.body)
    if (!req.body.user || !req.body.contraseña) {
        return res.send({ res: false, message: "Los campos no pueden estar vacíos." });
    } else {
        const comprobar = await realizarQuery(
            `SELECT * FROM Jugadores WHERE usuario = '${req.body.user}' AND contraseña = ${req.body.contraseña}`
        );
        console.log(comprobar)
        if (comprobar.length > 0) {
            res.send({ res: true, idLogged: comprobar[0].id_jugador, user: comprobar[0].usuario });
        } else {
            res.send({ res: false });
        }
    }
});

app.post('/register', async function (req, res) {
    console.log(req.body);
    const comprobar = await realizarQuery(
        `SELECT * FROM Jugadores WHERE usuario = ${req.body.usuario}`
    );

    if (comprobar.length == 0) {
        const respuesta = await realizarQuery(`INSERT INTO Jugadores (contraseña, email, nombre, usuario)
        VALUES ('${req.body.contraseña}', '${req.body.email}', ${req.body.nombre}, '${req.body.usuario}')`)
        res.send({ res: true, idLogged: respuesta.insertId })
    } else {
        res.send({ res: false })
    }
})

let jugadoresEnLinea = []
// ============= SOCKET.IO - CORREGIDO =============
io.on("connection", (socket) => {
    const req = socket.request;

    console.log("✅ Nueva conexión socket:", socket.id);


    socket.on('joinRoom', data => {
        console.log("Usuario uniéndose a sala:", data);

        // Salir de la sala anterior si existe
        if (req.session.room) {
            socket.leave(req.session.room);
            if (jugadoresEnLinea.length > 0) {
                for (let i = 0; i < jugadoresEnLinea;i++){
                    if(jugadoresEnLinea[i] == data.userId){
                        jugadoresEnLinea.splice(i)
                    }
                }
            }

            console.log("Salió de sala:", req.session.room);
            //sacar del vectpr creo q con splice
        }

        // Guardar la sala y el usuario en la sesión
        req.session.room = data.room;
        if (data.userId) {
            req.session.user = data.userId;
            jugadoresEnLinea.push(data.userId)
        }

        // Unirse a la nueva sala
        socket.join(req.session.room);
        io.to(data.room).emit('jugadores_en_linea', { jugadores: jugadoresEnLinea })
        
        console.log("🚪 Entró a sala:", req.session.room);

        req.session.save();
    })
    //socket.join('global');
    socket.on('nuevaPartida', async data => {
        console.log("")
    })
    // Cuando se envía un mensaje
    socket.on('sendMessage', async data => {
        console.log("Mensaje recibido para enviar:", data);

        const room = data.room || req.session.room;

        if (!room) {
            console.error("No hay sala definida para enviar el mensaje");
            return;
        }

        // ✅ Traer info del usuario desde la BD
        const usuario = await realizarQuery(
            `SELECT nombre, apellido, foto_perfil FROM Usuarios WHERE id_usuario = ${data.mensaje.id_usuario}`
        );

        // Emitir el mensaje con toda la info
        io.to(room).emit('new_message', {
            room: room,
            message: data.mensaje.contenido || data.mensaje.mensaje,
            userId: data.mensaje.id_usuario,
            nombre: usuario[0]?.nombre || '',
            apellido: usuario[0]?.apellido || '',
            foto_perfil: usuario[0]?.foto_perfil || null,
            timestamp: Date.now()
        });

        console.log("Mensaje emitido a sala:", room);
    });

    // Opcional: Para salir de una sala
    socket.on('leaveRoom', data => {
        if (data.room) {
            socket.leave(data.room);
            console.log("🚪 Usuario salió de sala:", data.room);
        }
    });

    socket.on('disconnect', () => {
        console.log("❌ Socket desconectado:", socket.id);
    });
});