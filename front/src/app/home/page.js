"use client"

import { useState, useEffect } from "react";
import Button from "@/components/Boton";
import Input from "@/components/Input";
import { useSearchParams } from "next/navigation";
import styles from "@/app/home/page.module.css";
import { useSocket } from "../hooks/useSocket";
import PopUp from "@/components/PopUp";

export default function Login() {

    const searchParams = useSearchParams();
    const usuario = searchParams.get("user");
    const idLogged = searchParams.get("idLogged");
    const { socket, isConnected } = useSocket();
    const [usuariosEnLinea, setUsuariosEnLinea] = useState([]);
    const [nombresEnLinea, setNombresEnLinea] = useState([]);

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
                                <h1>Crear partida</h1>
                                <h2>Elige uno de los jugadores en línea:</h2>
                                <select>
                                    {usuariosEnLinea.length != 0 ? (
                                        usuariosEnLinea.map((usuarioId) => {
                                            if (usuarioId !== Number(idLogged)) {
                                                return (<option key={usuarioId} value={usuarioId}>Jugador {usuarioId}</option>)
                                            }
                                        }
                                        )
                                    ) : <option>No hay jugadores en línea</option>}
                                </select>
                            </div>
                        </PopUp>
                    </div>
                    <div>
                        <button className={styles.boton}>Ver puntajes</button>
                    </div>
                </div >
                <h2>{nombresEnLinea}</h2>
            </section >






        </>

    )

}