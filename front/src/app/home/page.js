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

    useEffect(() => {
        if (!socket || !isConnected || !idLogged) return;

        console.log("Uniéndose a sala:", 0, "Usuario:", idLogged);
        socket.emit("joinRoom", {
            room: 0,
            userId: Number(idLogged)
        });

        return () => {
            socket.emit("leaveRoom", { room: 0 });
        };
    }, [socket, isConnected, idLogged])

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
                            <div>
                                <h1>soy children</h1>
                            </div>
                       </PopUp>
                    </div>
                    <div>
                        <button className={styles.boton}>Ver puntajes</button>
                    </div>
                    
                </div>
            </section>






        </>

    )

}