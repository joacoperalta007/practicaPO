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
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
  credentials: true
}));

app.use(express.static('front/public'));

const server = app.listen(port, () => {
  console.log(`Servidor NodeJS corriendo en http://localhost:${port}/`);
});

const io = require('socket.io')(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
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

app.post('/getUsuarios', async function (req, res) {
  try {
    console.log(req.body)
    const user = await realizarQuery(`SELECT usuario FROM Jugadores WHERE id_jugador = ${req.body.userId}`);
    res.send({ res: true, usuario: user });
  } catch {
    res.send({ res: false, message: "Error interno del servidor." });
  }
})


/*app.post('/crearPartida', async function (req, res) {
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

    res.send({ res: true, idPartida: idPartida });
  } catch (error) {
    console.error("Error en /crearPartida:", error);
    res.send({ res: false, message: "Error creando la partida." });
  }
});*/
app.post('/crearPartida', async function (req, res) {
  try {
    console.log("Datos recibidos:", req.body);

    // Insertar la partida y obtener el insertId directamente
    const resultado = await realizarQuery(`
      INSERT INTO Partidas (id_ganador, barcos_hundidos_j1, barcos_hundidos_j2)
      VALUES (NULL, 0, 0)
    `);

    const idPartida = resultado.insertId;

    console.log("ID partida creada:", idPartida);

    // Insertar jugadores en la partida
    await realizarQuery(`
      INSERT INTO JugadoresPorPartida (id_partida, id_jugador)
      VALUES (${idPartida}, ${req.body.jugador1}), (${idPartida}, ${req.body.jugador2})
    `);

    console.log("Jugadores agregados a la partida");

    res.send({ res: true, idPartida: idPartida });
  } catch (error) {
    console.error("Error en /crearPartida:", error);
    res.send({ res: false, message: "Error creando la partida: " + error.message });
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
    res.send({ res: true });
  } catch (error) {
    console.error("Error en /cambiarNombre:", error);
    res.send({ res: false, mensaje: "Error al actualizar el nombre" });
  }
});

app.get('/historialPartidas', async function (req, res) {
  try {
    const historial = await realizarQuery(`
      SELECT p.id_partida, p.id_ganador, p.barcos_hundidos_j1, p.barcos_hundidos_j2
      FROM Partidas p
      JOIN JugadoresPorPartida jpp  ON Partidas.id_partida = jpp.id_partida
      WHERE jpp.id_jugador = ${req.query.id_jugador}
    `);

    res.send({ res: true, historial });
  } catch (error) {
    console.error("Error en /historialPartidas:", error);
    res.send({ res: false, message: "Error obteniendo el historial de partidas." });
  }
});


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
        for (let i = 0; i < jugadoresEnLinea.length; i++) {
          if (jugadoresEnLinea[i] == data.userId) {
            jugadoresEnLinea.splice(i, 1)
          }
        }
      }

      console.log("Salió de sala:", req.session.room);

    }

    // Guardar la sala y el usuario en la sesión
    req.session.room = data.room;
    if (data.userId) {
      req.session.user = data.userId;

      if (!jugadoresEnLinea.includes(data.userId)) {
        jugadoresEnLinea.push(data.userId);
      }
    }

    // Unirse a la nueva sala
    socket.join(req.session.room);

    io.to(data.room).emit('jugadores_en_linea', { jugadores: jugadoresEnLinea })

    console.log("🚪 Entró a sala:", req.session.room);

    req.session.save();
  })
  //socket.join('global');
  socket.on('nuevaPartida', async data => {
    console.log("jugador emisor: " + data.jugador1);
    console.log("jugador receptor: " + data.jugador2);

    // Emitir a toda la sala 0 (sala de espera)
    io.to(0).emit('partidaRequest', {
      player2Id: data.jugador2Id,
      player1Id: data.jugador1Id,
      player1Name: data.jugador1Nombre,
      player2Name: data.jugador2Nombre,
      idPartida: data.idPartida
    });
  });
  socket.on('enviar_imagen', async data=> {
    console.log("Enviando imagen: ",data.imagen);

    io.to(data.room).emit('recibir_imagen', {
      playerId: data.jugadorId,
      imagen: data.imagen,
    });
  })
  // Cuando se envía un mensaje

  // Opcional: Para salir de una sala
  socket.on('leaveRoom', data => {
    if (data.room) {
      socket.leave(data.room);
      console.log("🚪 Usuario salió de sala:", data.room);
    }
  });

  socket.on('disconnect', () => {
    console.log("Usuario desconectado");

    // Remover usuario de jugadoresEnLinea
    if (req.session.user) {
      const index = jugadoresEnLinea.indexOf(req.session.user);
      if (index !== -1) {
        jugadoresEnLinea.splice(index, 1);
      }

      // Emitir la lista actualizada a la sala
      if (req.session.room) {
        io.to(req.session.room).emit('jugadores_en_linea', { jugadores: jugadoresEnLinea });
      }

      console.log("Usuario removido:", req.session.user);
      console.log("Jugadores restantes:", jugadoresEnLinea);
    }
  });
});