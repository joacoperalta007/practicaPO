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

    const comprobar = await realizarQuery(`SELECT * FROM Jugadores WHERE usuario = '${req.body.user}' AND contraseña = '${req.body.contraseña}'`);

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

    const comprobar = await realizarQuery(`SELECT * FROM Jugadores WHERE usuario = '${req.body.user}'`);

    if (comprobar.length === 0) {
      const respuesta = await realizarQuery(`INSERT INTO Jugadores (contraseña, email, nombre, usuario)VALUES ('${req.body.contraseña}', '${req.body.email}', '${req.body.nombre}', '${req.body.user}')`);
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

    await realizarQuery(`INSERT INTO Partidas (id_ganador, barcos_hundidos_j1, barcos_hundidos_j2) VALUES (NULL, 0, 0)`);

    const idPartida = (await realizarQuery(`SELECT LAST_INSERT_ID() AS idPartida`))[0].idPartida;

    await realizarQuery(`INSERT INTO JugadoresPorPartida (id_partida, id_jugador) SELECT ${idPartida}, j.id_jugador FROM Jugadores j WHERE j.id_jugador IN (${req.body.jugador1}, ${req.body.jugador2})`);

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
    res.send({ res: true})
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

app.post('/agregarBarco', async function (req, res) {
  try {
    console.log(req.body);

    await realizarQuery(`INSERT INTO Barcos (longitud, impactos, id_partida, id_jugador) VALUES ('${req.body.longitud}', '${req.body.impactos}', '${req.body.id_partida}', '${req.body.id_jugador}')`);

    const idBarco = (await realizarQuery(`SELECT LAST_INSERT_ID() AS idBarco`))[0].idBarco;

    for (let i = 0; i < req.body.coordenadas.length; i++) {
      const arrayCords = req.body.coordenadas[i];
      await realizarQuery(`INSERT INTO Coordenadas (id_partida, id_barco, coordenada_barco, impacto) VALUES ('${req.body.id_partida}', ${idBarco}, '${arrayCords}', false)`);
    }

    res.send({ res: true, idBarco });
  } catch (error) {
    console.error("Error en /agregarBarco:", error);
    res.send({ res: false, message: "Error al agregar el barco." });
  }
});

app.post('/disparo', async function (req, res) {
  try {
    console.log(req.body);

    const coordenada = await realizarQuery(`SELECT Coordenadas.id_barco, Barcos.id_jugador FROM Coordenadas INNER JOIN Barcos ON Coordenadas.id_barco = Barcos.id_barco WHERE Coordenadas.id_partida = ${req.body.id_partida} AND Coordenadas.coordenada_barco = '${req.body.coordenada}' `);

    if (coordenada.length == 0) {
      return res.send({ res: true, impacto: false, message: "Agua" });
    }

    await realizarQuery(`UPDATE Coordenadas SET impacto = true WHERE id_barco = ${coordenada[0].id_barco} AND coordenada_barco = '${req.body.coordenada}'`);

    await realizarQuery(`UPDATE Barcos SET impactos = impactos + 1 WHERE id_barco = ${coordenada[0].id_barco}`);

    res.send({ res: true, impacto: true, message: "Impacto" });

  } catch (error) {
    console.error("Error en /disparo:", error);
    res.send({ res: false, message: "Error al procesar el disparo." });
  }
});



app.get('/historialPartidas', async function (req, res) {
  try {
    const historial = await realizarQuery(`SELECT p.id_partida, p.id_ganador, p.barcos_hundidos_j1, p.barcos_hundidos_j2 FROM Partidas p INNER JOIN JugadoresPorPartida jpp  ON Partidas.id_partida = jpp.id_partida WHERE jpp.id_jugador = ${req.query.id_jugador}`);

    res.send({ res: true, historial });
  } catch (error) {
    console.error("Error en /historialPartidas:", error);
    res.send({ res: false, message: "Error obteniendo el historial de partidas." });
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