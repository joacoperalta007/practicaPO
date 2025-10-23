"use client";

import { useState, useEffect, use } from "react";
import Button from "@/components/Boton";
import Input from "@/components/Input";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "@/app/home/page.module.css";
import { useSocket } from "../hooks/useSocket";
import Image from 'next/image';
import PopUp from "@/components/PopUp";
import { useRouter } from "next/navigation";

export default function Home() {

    const searchParams = useSearchParams();
    const usuario = searchParams.get("user");
    const idLogged = searchParams.get("idLogged");
    const { socket, isConnected } = useSocket();
    const [usuariosEnLinea, setUsuariosEnLinea] = useState([]);
    const [nombresEnLinea, setNombresEnLinea] = useState([]);
    const [selectedImg, setSelectedImg] = useState(null);
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);
    const [selectedPlayerName, setSelectedPlayerName] = useState(null);
    const [partidaRequest, setPartidaRequest] = useState(false);
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const router = useRouter();
    const [idPartida, setIdPartida] = useState(null)
    /*const [jugador2, setJugador2] = useState("")
    const [jugador1, setJugador1] = useState("")*/
    const [jugador1Nombre, setJugador1Nombre] = useState("");
    const [jugador2Nombre, setJugador2Nombre] = useState("");
    const [jugador1Id, setJugador1Id] = useState(null);
    const [jugador2Id, setJugador2Id] = useState(null);
    const [selectedImg2, setSelectedImg2] = useState(null);

    const personajes = [
        "/imagenes/pablo.jpg",
        "/imagenes/flandua.jpg",
        "/imagenes/benchi.jpg",
        "/imagenes/bergondi.jpg",
        "/imagenes/brendix.jpg",
        "/imagenes/sturla.jpg",
        "/imagenes/santi.jpg",
        "/imagenes/caro.jpg",
        "/imagenes/rivas.jpg",
        "/imagenes/estrella.jpg",
        "/imagenes/calamardo.jpg",
        "/imagenes/caracol.jpg",
        "/imagenes/bob.jpg",
        "/imagenes/ardilla.jpg",
        "/imagenes/cangrejo.jpg",
        "/imagenes/bichito.jpg"

    ]
    useEffect(() => {
        if (selectedPlayerId) {
            try {
                const response = fetch('http://localhost:4000/getUsuarios', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId: selectedPlayerId })
                })
                    .then(response => response.json())
                    .then(response => {
                        if (response.res) {
                            const selectedUser = response.usuario[0].usuario
                            setSelectedPlayerName(selectedUser)
                        }

                    })
            } catch {
                console.log("error en getUsuario selected")
            }
        }
    }, [selectedPlayerId])
    useEffect(() => {
        if (partidaRequest == true) {
            setMostrarPopup(true);
        }
    }, [partidaRequest]);
    /*useEffect(() => {
        if (!socket || !isConnected || !idLogged) return;

        console.log("Uniéndose a sala:", 0, "Usuario:", idLogged);
        socket.emit("joinRoom", {
            room: 0,
            userId: Number(idLogged)
        });
        socket.on("jugadores_en_linea", data => {
            console.log("Jugadores en línea:", data.jugadores);
            setUsuariosEnLinea(data.jugadores);
            console.log("Usuarios en línea actualizados:", data.jugadores);
        });

        socket.on('partidaRequest', data => {
            console.log("Petición de partida recibida:", data);

            // Solo mostrar si soy el jugador invitado
            if (Number(data.player2) === Number(idLogged)) {
                // Mostrar popup de invitación
                console.log(`${data.player1} te invitó a jugar. ID Partida: ${data.idPartida}`);
                // Aquí abrís tu popup
            }
        });
        return () => {
            socket.emit("leaveRoom", { room: 0 });
        };
    }, [socket, isConnected, idLogged])*/
    useEffect(() => {
        if (!socket || !isConnected || !idLogged) return;

        console.log("Uniéndose a sala:", 0, "Usuario:", idLogged);
        socket.emit("joinRoom", {
            room: 0,
            userId: Number(idLogged)
        });

        socket.on("jugadores_en_linea", data => {
            console.log("Jugadores en línea:", data.jugadores);
            setUsuariosEnLinea(data.jugadores);
        });

        socket.on('partidaRequest', data => {
            console.log("Petición de partida recibida:", data);

            // Solo mostrar si soy el jugador invitado
            if (Number(data.player2Id) === Number(idLogged)) {
                console.log(`${data.player1} te invitó a jugar. ID Partida: ${data.idPartida}`);
                setJugador1Nombre(data.player1Name);
                setJugador2Nombre(data.player2Name)
                setJugador1Id(data.player1Id);
                setJugador2Id(data.player2Id)
                setIdPartida(data.idPartida);
                setMostrarPopup(true); // ✅ Esto muestra el popup
            }
        });
        socket.on("recibir_imagen", data=>{
            console.log("recibiendo imagen: ")
            if(!selectedImg){
                setSelectedImg(data.imagen)
            }else{
                setSelectedImg2(data.imagen)
            }
        })
        return () => {
            socket.emit("leaveRoom", { room: 0 });
            socket.off("jugadores_en_linea");
            socket.off("partidaRequest");
        };
    }, [socket, isConnected, idLogged]);
    useEffect(() => {
        if (usuariosEnLinea.length > 0) {
            jugadores();
        }

    }, [usuariosEnLinea])


    useEffect(() => {
        console.log("imagen elegida:", selectedImg);
        console.log("jugador elegido:", selectedPlayerId);
    }, [selectedImg][selectedPlayerId])


    /*function crearPartida() {
        if (!socket || !isConnected || !selectedPlayerId || !selectedImg) {
            alert("no seleccionaste nada")
            return;
        }
        const data = {
            jugador1: idLogged,
            jugador2: selectedPlayerId,
        }
        const dataSocket = {
            jugador1Nombre: usuario,
            jugador1Id: idLogged,
            jugador1Nombre: usuario,
            jugador2Id: selectedPlayerId,
            jugador2Nombre: selectedPlayerName
        }
        //pasar los datos a la siguiente pagina
        try {
            fetch('http://localhost:4000/crearPartida', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(response => {
                    if (response.res) {
                        const nuevaPartidaId = response.idPartida
                        //socket emit un mensaje al otro jugador
                        setIdPartida(nuevaPartidaId)
                        if (socket && isConnected) {
                            socket.emit("nuevaPartida", {
                                jugador1Nombre: dataSocket.jugador1Nombre,
                                jugador2Nombre: dataSocket.jugador2Nombre,
                                jugador1Id: dataSocket.jugador1Id,
                                jugador2Id: dataSocket.jugador2Id,
                                idPartida: idPartida
                            })
                            socket.emit("leaveRoom", { room: 0 });
                            console.log("Uniéndose a sala:", idPartida, "Usuario:", idLogged);
                            socket.emit("joinRoom", {
                                room: nuevaPartidaId,
                                userId: Number(idLogged)
                            });
                            console.log("Uniéndose a sala:", idPartida, "Usuario:", idLogged);
                        }

                    } else {
                        console.log("Error al crear partida");
                    }
                })
        } catch {
            console.log("error")
        }*/
    async function crearPartida() {
        if (!socket || !isConnected || !selectedPlayerId || !selectedImg) {
            alert("no seleccionaste nada");
            return;
        }

        const data = {
            jugador1: idLogged,
            jugador2: selectedPlayerId,
        };

        try {
            const response = await fetch('http://localhost:4000/crearPartida', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.res) {
                const nuevaPartidaId = result.idPartida;
                setIdPartida(nuevaPartidaId);

                console.log("Partida creada con ID:", nuevaPartidaId);

                if (socket && isConnected) {
                    socket.emit("nuevaPartida", {
                        jugador1Nombre: usuario,
                        jugador2Nombre: selectedPlayerName,
                        jugador1Id: idLogged,
                        jugador2Id: selectedPlayerId,
                        idPartida: nuevaPartidaId  // ✅ Usar el valor directo
                    });

                    socket.emit("leaveRoom", { room: 0 });
                    socket.emit("joinRoom", {
                        room: nuevaPartidaId,  // ✅ Usar el valor directo
                        userId: Number(idLogged)
                    });

                    console.log("Unido a sala de partida:", nuevaPartidaId);
                }
            } else {
                console.log("Error al crear partida");
            }
        } catch (error) {
            console.error("Error:", error);
        }

        socket.emit("enviar_imagen",{
            room: idPartida,
            imagen: selectedImg
        })
        //cuando creas partida, se une al room de la partida
        let url = "/partida?idLogged=" + idLogged + "&jugador1Id=" + idLogged + "&jugador1Nombre=" + usuario + "&jugador2Id=" + selectedPlayerId + "&jugador2Nombre=" + selectedPlayerName + "&img1=" + selectedImg + "&img2=" + selectedImg2 + "&idPartida=" + idPartida;
        router.push(url);
    }
    function unirseAPartida() {
        console.log("Uniendose a partida: ", idPartida)
        socket.emit("enviar_imagen",{
            room: idPartida,
            imagen: selectedImg2
            
        })
        let url = "/partida?idLogged=" + idLogged + "&jugador1Id=" + jugador1Id + "&jugador1Nombre=" + jugador1Nombre + "&jugador2Id=" + idLogged + "&jugador2Nombre=" + usuario + "&img2=" + selectedImg2 + "&img1=" + selectedImg + "&idPartida=" + idPartida;
        while(!selectedImg && !selectedImg2){
            console.log("no selecciono el otro usuario todavia")
        }
        router.push(url);
            
                
    }
    function scores() {

    }
    /*function jugadores() {
        for (let i = 0; i < usuariosEnLinea.length; i++) {
            console.log("Usuario en linea:", usuariosEnLinea[i]);
            fetch('http://localhost:4000/getUsuarios', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: usuariosEnLinea[i] })
            })
                .then(response => response.json())
                .then(response => {
                    if (response.res) {
                        console.log(response)
                        setNombresEnLinea(prevNombres => [...prevNombres, response.usuario[0].usuario]);
                    } else {
                        console.log("error")
                    }
                })
        }
     
    }*/
    async function jugadores() {
        const usuariosCompletos = [];

        for (let i = 0; i < usuariosEnLinea.length; i++) {
            console.log("Usuario en linea:", usuariosEnLinea[i]);

            try {
                const response = await fetch('http://localhost:4000/getUsuarios', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId: usuariosEnLinea[i] })
                });

                const data = await response.json();

                if (data.res) {
                    console.log(data);
                    // Agregar objeto con id y nombre en la misma posición
                    usuariosCompletos.push({
                        id: usuariosEnLinea[i],
                        nombre: data.usuario[0].usuario
                    });
                } else {
                    console.log("error");
                }
            } catch (error) {
                console.log("Error en fetch:", error);
            }
        }

        // Actualizar el estado una sola vez con todos los usuarios
        setNombresEnLinea(usuariosCompletos);
    }

    //cuando tocas en PC1 el crear partida y elegis un jugador (de 
    // los que estan en linea (rooms)) a PC2
    // le aparece un aviso popup para unirse a la partida)
    return (

        <>
            <section>
                <div className={styles.header}>
                    <h1>¡Bienvenido {usuario} a Batalla naval! </h1>
                </div>
            </section>
            <section className={styles.section1}>
                <div className={styles.contenedor}>
                    <div>
                        <PopUp boton={<button className={styles.boton} onClick={crearPartida}>Crear partida</button>}>
                            <div className={styles.crearPartidaPopup}>
                                <h2 className={styles.titulo}>Crear partida</h2>
                                <h2 className={styles.text}>Elegí uno de los jugadores en línea:</h2>
                                <select onChange={(e) => setSelectedPlayerId(e.target.value)} className={styles.selectJugador}>
                                    <option className={styles.option} key={0} value={0}>Sin seleccionar</option>
                                    {nombresEnLinea.length > 1 ? (
                                        nombresEnLinea.map((nombre) => {
                                            if (nombre.id !== Number(idLogged)) {
                                                return (<option className={styles.option} key={nombre.id} value={nombre.id}>{nombre.nombre}</option>)
                                            }
                                        }
                                        )
                                    ) : <option className={styles.option}>No hay jugadores en línea</option>}
                                </select>
                                <h2 className={styles.text}>Elegí un personaje:</h2>
                                <div className={styles.personajes}>
                                    {personajes.map((personaje, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImg(personaje)}
                                            className={`${styles.botonFoto} ${selectedImg === personaje ? styles.selected : ''}`}
                                        >
                                            <img
                                                src={personaje}
                                                alt={`Personaje ${index}`}
                                                className={styles.personaje}
                                            />
                                        </button>
                                    ))}
                                </div>

                            </div>

                            <div className={styles.crearP}>
                                <button className={styles.botonCrearPartida} onClick={crearPartida}>crear partida</button>
                            </div>
                        </PopUp>
                    </div>
                    <div>
                        <button className={styles.boton}>Ver puntajes</button>
                    </div>
                </div >

            </section >
            <PopUp
                open={mostrarPopup}
                tipo={null}
                onClose={() => {
                    setMostrarPopup(false);

                }}
            >
                <h2 className={styles.text}>¡{jugador1Nombre} te está invitando a una partida!</h2>
                <div className={styles.personajes}>
                    {personajes.map((personaje, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImg2(personaje)}
                            className={`${styles.botonFoto} ${selectedImg2 === personaje ? styles.selected : ''}`}
                        >
                            <img
                                src={personaje}
                                alt={`Personaje ${index}`}
                                className={styles.personaje}
                            />
                        </button>
                    ))}
                </div>
                <button className={styles.botonAceptar} onClick={unirseAPartida}>Aceptar</button>
            </PopUp>





        </>

    )
}
/* <div className={styles.personajes}>
    {personajes.map((personaje, index) => (
        <button key={index} onClick={() => setSelectedImg(personaje)} className={styles.botonFoto}><img src={personaje} key={index} className={styles.personaje} /></button>
    ))}</div>*/
