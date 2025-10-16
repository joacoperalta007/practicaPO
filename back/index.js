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

app.post('/login', async function login(req, res) {
  try {
    console.log(req.body);

    if (!req.body.user || !req.body.contraseña) {
      return res.send({ res: false, message: "Los campos no pueden estar vacíos." });
    }

    const comprobar = await realizarQuery(
      `SELECT * FROM Jugadores WHERE usuario = '${req.body.user}' AND contraseña = '${req.body.contraseña}'`
    );

    console.log(comprobar);

    if (comprobar.length > 0) {
      res.send({
        res: true,
        idLogged: comprobar[0].id_jugador,
        user: comprobar[0].usuario
      });
    } else {
      res.send({ res: false, message: "Usuario o contraseña incorrectos." });
    }
  } catch (error) {
    console.error("Error en /login:", error);
    res.send({ res: false, message: "Error interno del servidor." });
  }
});


app.post('/register', async function (req, res) {
  try {
    console.log(req.body);

    const comprobar = await realizarQuery(
      `SELECT * FROM Jugadores WHERE usuario = '${req.body.user}'`
    );

    if (comprobar.length === 0) {
      const respuesta = await realizarQuery(`
        INSERT INTO Jugadores (contraseña, email, nombre, usuario)
        VALUES ('${req.body.contraseña}', '${req.body.email}', '${req.body.nombre}', '${req.body.user}')
      `);
      res.send({ res: true, idLogged: respuesta.insertId });
    } else {
      res.send({ res: false, message: "El usuario ya existe." });
    }
  } catch (error) {
    console.error("Error en /register:", error);
    res.send({ res: false, message: "Error interno del servidor." });
  }
});


app.post('/crearPartida', async function (req, res) {
  try {
    console.log(req.body);

    await realizarQuery(`
      INSERT INTO Partidas (id_ganador, barcos_hundidos_j1, barcos_hundidos_j2)
      VALUES (NULL, 0, 0)
    `);

    const idPartida = (await realizarQuery(`SELECT LAST_INSERT_ID() AS idPartida`))[0].idPartida;

    await realizarQuery(`
      INSERT INTO JugadoresPorPartida (id_partida, id_jugador)
      SELECT ${idPartida}, j.id_jugador
      FROM Jugadores j
      WHERE j.id_jugador IN (${req.body.jugador1}, ${req.body.jugador2})
    `);

    res.send({ res: true, idPartida });
  } catch (error) {
    console.error("Error en /crearPartida:", error);
    res.send({ res: false, message: "Error creando la partida." });
  }
});

app.delete('/eliminarJugador', async function (req, res) {
  try {
    console.log(req.body)
    await realizarQuery(`DELETE FROM Jugadores WHERE id_jugador = ${req.body.id_jugador}`)
    res.send({ res: true, id_jugador })
  } catch (error) {
    console.error("Error en /eliminarJugador:", error);
    res.send({ res: false, message: "Error eliminando el jugador." });
  }
})

app.put('/cambiarNombre', async function (req, res) {
  try {
    console.log(req.body)
    await realizarQuery(` UPDATE Jugadores SET nombre = '${req.body.nombre}' WHERE id_jugador = ${req.body.id_jugador}`);
    res.send({ res: true});
  } catch (error) {
    console.error("Error en /cambiarNombre:", error);
    res.send({ res: false, mensaje: "Error al actualizar el nombre" });
  }
});

// ============= SOCKET.IO - CORREGIDO =============
io.on("connection", (socket) => {
  const req = socket.request;

  console.log("✅ Nueva conexión socket:", socket.id);


  socket.on('joinRoom', data => {
    console.log("Usuario uniéndose a sala:", data);

    // Salir de la sala anterior si existe
    if (req.session.room) {
      socket.leave(req.session.room);
      console.log("Salió de sala:", req.session.room);
    }

    // Guardar la sala y el usuario en la sesión
    req.session.room = data.room;
    if (data.userId) {
      req.session.user = data.userId;
    }

    // Unirse a la nueva sala
    socket.join(req.session.room);
    console.log("🚪 Entró a sala:", req.session.room);

    req.session.save();
  })
  socket.join('global');

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