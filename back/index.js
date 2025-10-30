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
}); //funciona


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

    await realizarQuery(`INSERT INTO Partidas (id_ganador, barcos_hundidos_j1, barcos_hundidos_j2) VALUES (NULL, 0, 0)`);

    const idPartida = (await realizarQuery(`SELECT LAST_INSERT_ID() AS idPartida`))[0].idPartida;

    await realizarQuery(`INSERT INTO JugadoresPorPartida (id_partida, id_jugador) SELECT ${idPartida}, j.id_jugador FROM Jugadores j WHERE j.id_jugador IN (${req.body.jugador1}, ${req.body.jugador2})`);

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

app.post('/agregarBarco', async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body);

    const id_partida = req.body.id_partida;
    const id_jugador = req.body.id_jugador;
    const barcos = req.body.barcos;

    for (const barco of barcos) {
      const resultadoBarco = await realizarQuery(`
        INSERT INTO Barcos (longitud, impactos, id_partida, id_jugador)
        VALUES ('${barco.longitud}', '${barco.impactos}', '${id_partida}', '${id_jugador}')
      `);

      const idBarco = resultadoBarco.insertId;
      console.log("idBarco creado:", idBarco);

      for (const coord of barco.coordenadas) {
        await realizarQuery(`
          INSERT INTO Coordenadas (id_partida, id_barco, coordenada_barco, impacto)
          VALUES ('${id_partida}', ${idBarco}, '${coord}', false)
        `);
      }
    }

    res.send({ res: true, message: "Barcos agregados con éxito" });

  } catch (error) {
    console.error("Error en /agregarBarco:", error);
    res.send({ res: false, message: "Error al agregar barcos" });
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
    res.send({ res: true });
  } catch (error) {
    console.error("Error en /cambiarNombre:", error);
    res.send({ res: false, mensaje: "Error al actualizar el nombre" });
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

app.get('/traerBarcos', async function (req, res) {
  try {
    console.log(req.body)
    const consulta = await realizarQuery(`SELECT * FROM Barcos`);
    res.send({ res: true, consulta});
  } catch (error) {
    console.error("Error en /traerBarcos:", error);
    res.send({ res: false, message: "Error para traer los barcos." });
  }
});

let jugadoresEnLinea = []

// ============= SOCKET.IO =============
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
    

    io.to(data.room).emit('jugadores_en_linea', { jugadores: jugadoresEnLinea });
    console.log("🚪 Entró a sala:", req.session.room);
    req.session.save();

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
      imagen1: data.imagen1
    });
  });
  socket.on("enviar_disparo", async data =>{
    console.log("Enviando disparo: ", data.casilla, " a jugador: ", data.receptor)

    io.to(data.room).emit("recibir_disparo", {
      receptor: data.receptor,
      casilla: data.casilla,
      emisor: data.emisor
    }
    )
  })
  socket.on("cambiar_turno", async data =>{
    console.log("Era turno de: ", data.emisor, " ahora es turno de: ", data.receptor)

    io.to(data.room).emit("aceptar_turno", {
      receptor: data.receptor,
      emisor: data.emisor
    })
  })
  socket.on("enviar_barcos", async data => {
    console.log("Enviando barcos: ", data.barcos, " a jugador: ", data.jugador2)
    
    io.to(data.room).emit('recibir_barcos', {
      receptor: data.jugador2,
      barcos: data.barcos,
      emisor: data.jugador1
    })
  })
  socket.on("enviar_partidaId", async data => {
    console.log("Enviando id: ", data.partidId, " a jugador: ", data.jugador2)

    io.to(0).emit('recibir_idPartida', {
      partidaId: data.partidaId,
      jugador2: data.jugador2
    })
  })
  socket.on('enviar_imagen', async data => {
    console.log("Enviando imagen: ", data.imagen);

    io.to(0).emit('recibir_imagen', {
      player1Id: data.jugador1Id,
      player2Id: data.jugador2Id,
      imagen: data.imagen,
    });
  })

  
  // Cuando se envía un mensaje
  socket.on('solicitar_imagenes', data => {
    console.log("Solicitando imágenes en room:", data.room);
    // Emitir a todos en el room EXCEPTO al que envió la solicitud
    socket.to(data.room).emit('reenviar_imagen', { room: data.room });
  });
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