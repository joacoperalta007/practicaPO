"use client"

import { useState, useEffect } from "react";
import Button from "@/components/Boton";
import Input from "@/components/Input";
import { useSearchParams } from "next/navigation";
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
        return () => {
            socket.emit("leaveRoom", { room: 0 });
        };
    }, [socket, isConnected, idLogged])
    useEffect(() => {
        if (usuariosEnLinea.length > 0) {
            jugadores();
        }

    }, [usuariosEnLinea])
    function crearPartida() {

        //fetch('crearPartida')

        //cuando creas partida, se une al room de la partida
        if (!socket || !isConnected || !idLogged) return;

        console.log("Uniéndose a sala:", idPartida, "Usuario:", idLogged);
        socket.emit("joinRoom", {
            room: idPartida,
            userId: Number(idLogged)
        });

        return () => {
            socket.emit("leaveRoom", { room: idPartida });
        };
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
                                <select className={styles.selectJugador}>
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
                                        <img src={personaje} key={index} className={styles.personaje} />
                                    ))}
                                </div>
                            </div>

                            <div className={styles.botonCrearPartida}>
                                <Button text="crear partida"></Button>
                            </div>
                        </PopUp>
                    </div>
                    <div>
                        <button className={styles.boton}>Ver puntajes</button>
                    </div>
                </div >

            </section >






        </>

    )

}