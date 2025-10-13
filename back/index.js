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
    if (!req.body.numero_telefono || !req.body.contraseña) {
        return res.send({ res: false, message: "Los campos no pueden estar vacíos." });
    } else {
        const comprobar = await realizarQuery(
            `SELECT * FROM Usuarios WHERE numero_telefono = ${req.body.numero_telefono} AND contraseña = '${req.body.contraseña}'`
        );
        console.log(comprobar)
        if (comprobar.length > 0) {
            res.send({ res: true, idLogged: comprobar[0].id_usuario });
        } else {
            res.send({ res: false });
        }
    }
});

app.post('/register', async function (req, res) {
    console.log(req.body);
    const comprobar = await realizarQuery(
        `SELECT * FROM Usuarios WHERE numero_telefono = ${req.body.numero_telefono}`
    );

    if (comprobar.length == 0) {
        const respuesta = await realizarQuery(`INSERT INTO Usuarios (contraseña, foto_perfil, numero_telefono, descripcion, nombre, apellido)
        VALUES ('${req.body.contraseña}', '${req.body.foto_perfil}', ${req.body.numero_telefono}, '${req.body.descripcion}', '${req.body.nombre}', '${req.body.apellido}')`)
        res.send({ res: true, idLogged: respuesta.insertId })
    } else {
        res.send({ res: false })
    }
})

app.post('/chats', async function (req, res) {
    console.log(req.body)
    const chats = await realizarQuery(` SELECT DISTINCT
          c.id_chat,
          c.es_grupo,
          c.nombre_grupo AS nombre,
          c.foto_grupo   AS foto,
          c.descripcion  AS descripcion
      FROM UsuariosPorChat upc
      INNER JOIN Chats c 
          ON upc.id_chat = c.id_chat
      WHERE upc.id_usuario = ${req.body.idLogged}
        AND c.es_grupo = 1

      UNION

      SELECT 
          c.id_chat,
          c.es_grupo,
          CONCAT(u.nombre, ' ', u.apellido) AS nombre,
          u.foto_perfil AS foto,
          u.descripcion AS descripcion
      FROM UsuariosPorChat upc
      INNER JOIN Chats c 
          ON upc.id_chat = c.id_chat
      INNER JOIN UsuariosPorChat upc2 
          ON upc2.id_chat = c.id_chat 
         AND upc2.id_usuario <> ${req.body.idLogged}
      INNER JOIN Usuarios u 
          ON u.id_usuario = upc2.id_usuario
      WHERE upc.id_usuario = ${req.body.idLogged}
        AND c.es_grupo = 0;`)
    if (chats.length > 0) {
        res.send({ chats })
    } else {
        res.send({ res: false })
    }
})

app.post('/mensajes', async function (req, res) {
    console.log(req.body)
    const msj = await realizarQuery(`SELECT m.id_mensaje,
        m.mensaje,
        m.hora_de_envio,
        u.id_usuario,
        u.nombre,
        u.apellido,
        u.foto_perfil
        FROM Mensajes m
        JOIN Usuarios u ON m.id_usuario = u.id_usuario
        WHERE m.id_chat = ${req.body.idChat}
        ORDER BY m.hora_de_envio ASC`)

    // CAMBIÁ ESTE IF:
    if (msj.length > 0) {
        res.send({ msj })
    } else {
        res.send({ msj: [] })  // En lugar de { res: false }
    }
})
app.post('/enviarMensaje', async function (req, res) {
    console.log(req.body)
    const respuesta = await realizarQuery(`INSERT INTO Mensajes (mensaje, hora_de_envio, id_usuario, id_chat)
    VALUES ('${req.body.mensaje}', NOW(), ${req.body.id_usuario}, ${req.body.id_chat})`)
    if (respuesta != null) {
        res.send({ res: true })
    } else {
        res.send({ res: false })
    }
})
//
app.post('/probando', async function (req, res) {
    console.log(req.body)
    const respuesta = await realizarQuery(`SELECT mensaje FROM Mensajes WHERE id_mensaje = ${req.body.id} `)
    console.log(respuesta)
    if (respuesta != null) {
        res.send({ res: true, mensaje: respuesta[0].mensaje })
    }
})

app.post('/agregarChat', async function (req, res) {
    console.log(req.body);
    try {
        const { telefonos, idLogged, es_grupo, nombre_grupo, foto_grupo, descripcion } = req.body;

        // Crear el chat
        const crear = await realizarQuery(`
            INSERT INTO Chats (es_grupo, nombre_grupo, foto_grupo, descripcion)
            VALUES (
                ${es_grupo}, 
                ${nombre_grupo ? `'${nombre_grupo}'` : 'NULL'}, 
                ${foto_grupo ? `'${foto_grupo}'` : 'NULL'}, 
                ${descripcion ? `'${descripcion}'` : 'NULL'}
            )
        `);

        const idChatNuevo = crear.insertId;

        // Agregar el usuario que crea el chat
        await realizarQuery(`
            INSERT INTO UsuariosPorChat (id_chat, id_usuario) 
            VALUES (${idChatNuevo}, ${idLogged})
        `);

        // Agregar los usuarios por teléfono
        for (let i = 0; i < telefonos.length; i++) {
            const user = await realizarQuery(`
                SELECT id_usuario FROM Usuarios WHERE numero_telefono = ${telefonos[i]}
            `);

            if (user.length > 0) {
                await realizarQuery(`
                    INSERT INTO UsuariosPorChat (id_chat, id_usuario) 
                    VALUES (${idChatNuevo}, ${user[0].id_usuario})
                `);
            }
        }

        // Obtener info del chat creado para devolverlo
        const chatCreado = await realizarQuery(`
            SELECT 
                c.id_chat,
                c.es_grupo,
                ${es_grupo ? 'c.nombre_grupo' : "CONCAT(u.nombre, ' ', u.apellido)"} AS nombre,
                ${es_grupo ? 'c.foto_grupo' : 'u.foto_perfil'} AS foto,
                ${es_grupo ? 'c.descripcion' : 'u.descripcion'} AS descripcion
            FROM Chats c
            ${!es_grupo ? `
                INNER JOIN UsuariosPorChat upc ON c.id_chat = upc.id_chat AND upc.id_usuario <> ${idLogged}
                INNER JOIN Usuarios u ON u.id_usuario = upc.id_usuario
            ` : ''}
            WHERE c.id_chat = ${idChatNuevo}
            LIMIT 1
        `);

        res.send({ res: true, chat: chatCreado[0] });
    } catch (error) {
        console.error('Error al crear chat:', error);
        res.send({ res: false, error: error.message });
    }
});


// ============= SOCKET.IO - CORREGIDO =============
io.on("connection", (socket) => {
    const req = socket.request;

    console.log("✅ Nueva conexión socket:", socket.id);

    // Cuando el usuario se une a una sala
    /*socket.on('joinRoom', data => {
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
    });*/
    socket.join('global');
//probando 
    socket.on('broadcastMessage', data => {
        console.log("Mensaje recibido para mostrar a todos:", data);

        const room = data.room || 'global';

        if (!data.mensaje) {
            console.error("No se proporcionó mensaje para mostrar");
            return;
        }

        // ✅ Emitir solo el mensaje a todos en la sala
        io.to(room).emit('displayFetchedMessage', {
            mensaje: data.mensaje
        });

        console.log("Mensaje emitido a sala:", room);
    });

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