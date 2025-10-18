"use client"

import { useState, useEffect, use } from "react";
import Button from "@/components/Boton";
import Input from "@/components/Input";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "@/app/home/page.module.css";
import { useSocket } from "../hooks/useSocket";
import Image from 'next/image';
import PopUp from "@/components/PopUp";

export default function Login() {

    const searchParams = useSearchParams();
    const usuario = searchParams.get("user");
    const idLogged = searchParams.get("idLogged");
    const { socket, isConnected } = useSocket();
    const [usuariosEnLinea, setUsuariosEnLinea] = useState([]);
    const [nombresEnLinea, setNombresEnLinea] = useState([]);
    const [selectedImg, setSelectedImg] = useState(null);
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);
    const [partidaRequest, setPartidaRequest] = useState(false);
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const router = useRouter();
    const [jugador2, setJugador2] = useState("")
    const [jugador1, setJugador1] = useState("")

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
        if(!socket || !isConnected || !idLogged)return;
        socket.on("partidaRequest", data => {
            console.log("Solicitu de partida recibida de:", data.jugador1);
            setPartidaRequest(true);
            setJugador1(data.jugador1);
            setJugador2(data.jugador2);
            setIdPartida(data.idPartida);
        });
    })
    useEffect(() => {
        if (partidaRequest == true) {
            setMostrarPopup(true);
        }
    }, [partidaRequest]);
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
    }, [socket, isConnected, idLogged])
    useEffect(() => {
        if (usuariosEnLinea.length > 0) {
            jugadores();
        }

    }, [usuariosEnLinea])
    useEffect(() => {
        console.log("imagen elegida:", selectedImg);
        console.log("jugador elegido:", selectedPlayerId);
    }, [selectedImg][selectedPlayerId])
    function crearPartida() {
        const data = {
            jugador1: idLogged,
            jugador2: selectedPlayerId,
        }
        //pasar los datos a la siguiente pagina

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
                    //socket emit un mensaje al otro jugador
                    setIdPartida(response.idPartida)
                } else {
                    console.log("error")
                }
            })
        socket.emit("nuevaPartida", {
            jugador1:data.jugador1,
            jugador2:data.jugador2,
            idPartida: idPartida
        })
        //cuando creas partida, se une al room de la partida
        if (!socket || !isConnected || !idLogged) return;
        socket.on("leaveRoom", {
            room: 0
        });
        console.log("Uniéndose a sala:", idPartida, "Usuario:", idLogged);
        socket.emit("joinRoom", {
            room: idPartida,
            userId: Number(idLogged)
        });
        //let url = "/partida?jugador1=" + idLogged+"&jugador2=" + selectedPlayerId + "&img1=" + selectedImg + "&img2=" + selectedImg2 + "idPartida=" + idPartida;
        //router.push(url);
        return () => {
            socket.emit("leaveRoom", { room: idPartida });
        };
    }
    function unirseAPartida(){
        console.log("Uniendose a partida: ", idPartida)
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

                            <div className={styles.botonCrearPartida}>
                                <button onClick={crearPartida}>crear partida</button>
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
                <h2>{jugador2} te está invitando a una partida!</h2>
                <boton className={styles.botonAceptar} onClick={unirseAPartida}>Aceptar</boton>
            </PopUp>





        </>

    )

}
/* <div className={styles.personajes}>
    {personajes.map((personaje, index) => (
        <button key={index} onClick={() => setSelectedImg(personaje)} className={styles.botonFoto}><img src={personaje} key={index} className={styles.personaje} /></button>
    ))}</div>*/