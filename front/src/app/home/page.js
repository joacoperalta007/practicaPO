"use client"

import { useState } from "react";
import Button from "@/components/Boton";
import Input from "@/components/Input";
import { useSearchParams } from "next/navigation";
import styles from "@/app/home/page.module.css";
import { useSocket } from "../hooks/useSocket";

export default function Login() {

    const searchParams = useSearchParams();
    const usuario = searchParams.get("user");
    const idLogged = searchParams.get("idLogged");
    const { socket, isConnected } = useSocket();

    useEffect(() => {
        if (!socket || !isConnected || idChat === 0 || !idLogged) return;

        console.log("Uniéndose a sala:", idChat, "Usuario:", idLogged);
        socket.emit("joinRoom", {
            room: idChat,
            userId: Number(idLogged)
        });

        return () => {
            socket.emit("leaveRoom", { room: idChat });
        };
    }, [idChat, socket, isConnected, idLogged])

    function crearPartida() {

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
                        <button className={styles.boton}>Crear partida</button>
                    </div>
                    <div>
                        <button className={styles.boton}>Ver puntajes</button>
                    </div>
                </div>
            </section>






        </>

    )

}