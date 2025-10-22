'use client'
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSocket } from "../hooks/useSocket";
import Image from 'next/image';
import PopUp from "@/components/PopUp";
import styles from "@/app/partida/page.module.css"

export default function pagina() {
    const { socket, isConnected } = useSocket();
    const searchParams = useSearchParams();
    const nombre1 = searchParams.get("jugador1Nombre")
    const nombre2 = searchParams.get("jugador2Nombre")
    const id1 = searchParams.get("jugador1Id")
    const id2 = searchParams.get("jugador2Id")
    const img1 = searchParams.get("img1")
    const img2 = searchParams.get("img2")
    const idPartida = searchParams.get("idPatida")
    /*useEffect(() => {
        if (!socket || !isConnected || !idLogged) return;

        console.log("Uniéndose a sala:", 0, "Usuario:", idLogged);
        socket.emit("joinRoom", {
            room: ,
            userId: Number(idLogged)
        });

        return () => {
            socket.emit("leaveRoom", { room: 0 });
        };
    }, [socket, isConnected, idLogged])*/
    return (

        <>
            <section className={styles.header}>
                <h1>Partida número: {idPartida}</h1>
                <h2>Jugador 1: {nombre1} ID: {id1}</h2>
                <h2>Jugador 2: {nombre2} ID: {id2}</h2>
                <label>Imagen jugador 1:</label>
                <img src={img1}></img>
                <label>Imagen jugador 2:</label>
                <img src={img2}></img>
            </section>
            <section id="tablero1" className={styles.section2}>
                <div id="A">
                    <div id="A1" className={styles.casillero}></div>
                    <div id="A2" className={styles.casillero}></div>
                    <div id="A3" className={styles.casillero}></div>
                    <div id="A4" className={styles.casillero}></div>
                    <div id="A5" className={styles.casillero}></div>
                    <div id="A6" className={styles.casillero}></div>
                    <div id="A7" className={styles.casillero}></div>
                    <div id="A8" className={styles.casillero}></div>
                    <div id="A9" className={styles.casillero}></div>
                    <div id="A10" className={styles.casillero}></div>
                </div>
                <div id="B">
                    <div id="B1" className={styles.casillero}></div>
                    <div id="B2" className={styles.casillero}></div>
                    <div id="B3" className={styles.casillero}></div>
                    <div id="B4" className={styles.casillero}></div>
                    <div id="B5" className={styles.casillero}></div>
                    <div id="B6" className={styles.casillero}></div>
                    <div id="B7" className={styles.casillero}></div>
                    <div id="B8" className={styles.casillero}></div>
                    <div id="B9" className={styles.casillero}></div>
                    <div id="B10" className={styles.casillero}></div>
                </div>
                <div id="C">
                    <div id="C1" className={styles.casillero}></div>
                    <div id="C2" className={styles.casillero}></div>
                    <div id="C3" className={styles.casillero}></div>
                    <div id="C4" className={styles.casillero}></div>
                    <div id="C5" className={styles.casillero}></div>
                    <div id="C6" className={styles.casillero}></div>
                    <div id="C7" className={styles.casillero}></div>
                    <div id="C8" className={styles.casillero}></div>
                    <div id="C9" className={styles.casillero}></div>
                    <div id="C10" className={styles.casillero}></div>
                </div>
                <div id="D">
                    <div id="D1" className={styles.casillero}></div>
                    <div id="D2" className={styles.casillero}></div>
                    <div id="D3" className={styles.casillero}></div>
                    <div id="D4" className={styles.casillero}></div>
                    <div id="D5" className={styles.casillero}></div>
                    <div id="D6" className={styles.casillero}></div>
                    <div id="D7" className={styles.casillero}></div>
                    <div id="D8" className={styles.casillero}></div>
                    <div id="D9" className={styles.casillero}></div>
                    <div id="D10" className={styles.casillero}></div>
                </div>
                <div id="E">
                    <div id="E1" className={styles.casillero}></div>
                    <div id="E2" className={styles.casillero}></div>
                    <div id="E3" className={styles.casillero}></div>
                    <div id="E4" className={styles.casillero}></div>
                    <div id="E5" className={styles.casillero}></div>
                    <div id="E6" className={styles.casillero}></div>
                    <div id="E7" className={styles.casillero}></div>
                    <div id="E8" className={styles.casillero}></div>
                    <div id="E9" className={styles.casillero}></div>
                    <div id="E10" className={styles.casillero}></div>
                </div>
                <div id="F">
                    <div id="F1" className={styles.casillero}></div>
                    <div id="F2" className={styles.casillero}></div>
                    <div id="F3" className={styles.casillero}></div>
                    <div id="F4" className={styles.casillero}></div>
                    <div id="F5" className={styles.casillero}></div>
                    <div id="F6" className={styles.casillero}></div>
                    <div id="F7" className={styles.casillero}></div>
                    <div id="F8" className={styles.casillero}></div>
                    <div id="F9" className={styles.casillero}></div>
                    <div id="F10" className={styles.casillero}></div>
                </div>
                <div id="G">
                    <div id="G1" className={styles.casillero}></div>
                    <div id="G2" className={styles.casillero}></div>
                    <div id="G3" className={styles.casillero}></div>
                    <div id="G4" className={styles.casillero}></div>
                    <div id="G5" className={styles.casillero}></div>
                    <div id="G6" className={styles.casillero}></div>
                    <div id="G7" className={styles.casillero}></div>
                    <div id="G8" className={styles.casillero}></div>
                    <div id="G9" className={styles.casillero}></div>
                    <div id="G10" className={styles.casillero}></div>
                </div>
                <div id="H">
                    <div id="H1" className={styles.casillero}></div>
                    <div id="H2" className={styles.casillero}></div>
                    <div id="H3" className={styles.casillero}></div>
                    <div id="H4" className={styles.casillero}></div>
                    <div id="H5" className={styles.casillero}></div>
                    <div id="H6" className={styles.casillero}></div>
                    <div id="H7" className={styles.casillero}></div>
                    <div id="H8" className={styles.casillero}></div>
                    <div id="H9" className={styles.casillero}></div>
                    <div id="H10" className={styles.casillero}></div>
                </div>
                <div id="I">
                    <div id="I1" className={styles.casillero}></div>
                    <div id="I2" className={styles.casillero}></div>
                    <div id="I3" className={styles.casillero}></div>
                    <div id="I4" className={styles.casillero}></div>
                    <div id="I5" className={styles.casillero}></div>
                    <div id="I6" className={styles.casillero}></div>
                    <div id="I7" className={styles.casillero}></div>
                    <div id="I8" className={styles.casillero}></div>
                    <div id="I9" className={styles.casillero}></div>
                    <div id="I10" className={styles.casillero}></div>
                </div>
                <div id="J">
                    <div id="J1" className={styles.casillero}></div>
                    <div id="J2" className={styles.casillero}></div>
                    <div id="J3" className={styles.casillero}></div>
                    <div id="J4" className={styles.casillero}></div>
                    <div id="J5" className={styles.casillero}></div>
                    <div id="J6" className={styles.casillero}></div>
                    <div id="J7" className={styles.casillero}></div>
                    <div id="J8" className={styles.casillero}></div>
                    <div id="J9" className={styles.casillero}></div>
                    <div id="J10" className={styles.casillero}></div>
                </div>
            </section>

            <section id="tablero2" className={styles.section2}>
                <div id="A">
                    <div id="A1" className={styles.casillero}></div>
                    <div id="A2" className={styles.casillero}></div>
                    <div id="A3" className={styles.casillero}></div>
                    <div id="A4" className={styles.casillero}></div>
                    <div id="A5" className={styles.casillero}></div>
                    <div id="A6" className={styles.casillero}></div>
                    <div id="A7" className={styles.casillero}></div>
                    <div id="A8" className={styles.casillero}></div>
                    <div id="A9" className={styles.casillero}></div>
                    <div id="A10" className={styles.casillero}></div>
                </div>
                <div id="B">
                    <div id="B1" className={styles.casillero}></div>
                    <div id="B2" className={styles.casillero}></div>
                    <div id="B3" className={styles.casillero}></div>
                    <div id="B4" className={styles.casillero}></div>
                    <div id="B5" className={styles.casillero}></div>
                    <div id="B6" className={styles.casillero}></div>
                    <div id="B7" className={styles.casillero}></div>
                    <div id="B8" className={styles.casillero}></div>
                    <div id="B9" className={styles.casillero}></div>
                    <div id="B10" className={styles.casillero}></div>
                </div>
                <div id="C">
                    <div id="C1" className={styles.casillero}></div>
                    <div id="C2" className={styles.casillero}></div>
                    <div id="C3" className={styles.casillero}></div>
                    <div id="C4" className={styles.casillero}></div>
                    <div id="C5" className={styles.casillero}></div>
                    <div id="C6" className={styles.casillero}></div>
                    <div id="C7" className={styles.casillero}></div>
                    <div id="C8" className={styles.casillero}></div>
                    <div id="C9" className={styles.casillero}></div>
                    <div id="C10" className={styles.casillero}></div>
                </div>
                <div id="D">
                    <div id="D1" className={styles.casillero}></div>
                    <div id="D2" className={styles.casillero}></div>
                    <div id="D3" className={styles.casillero}></div>
                    <div id="D4" className={styles.casillero}></div>
                    <div id="D5" className={styles.casillero}></div>
                    <div id="D6" className={styles.casillero}></div>
                    <div id="D7" className={styles.casillero}></div>
                    <div id="D8" className={styles.casillero}></div>
                    <div id="D9" className={styles.casillero}></div>
                    <div id="D10" className={styles.casillero}></div>
                </div>
                <div id="E">
                    <div id="E1" className={styles.casillero}></div>
                    <div id="E2" className={styles.casillero}></div>
                    <div id="E3" className={styles.casillero}></div>
                    <div id="E4" className={styles.casillero}></div>
                    <div id="E5" className={styles.casillero}></div>
                    <div id="E6" className={styles.casillero}></div>
                    <div id="E7" className={styles.casillero}></div>
                    <div id="E8" className={styles.casillero}></div>
                    <div id="E9" className={styles.casillero}></div>
                    <div id="E10" className={styles.casillero}></div>
                </div>
                <div id="F">
                    <div id="F1" className={styles.casillero}></div>
                    <div id="F2" className={styles.casillero}></div>
                    <div id="F3" className={styles.casillero}></div>
                    <div id="F4" className={styles.casillero}></div>
                    <div id="F5" className={styles.casillero}></div>
                    <div id="F6" className={styles.casillero}></div>
                    <div id="F7" className={styles.casillero}></div>
                    <div id="F8" className={styles.casillero}></div>
                    <div id="F9" className={styles.casillero}></div>
                    <div id="F10" className={styles.casillero}></div>
                </div>
                <div id="G">
                    <div id="G1" className={styles.casillero}></div>
                    <div id="G2" className={styles.casillero}></div>
                    <div id="G3" className={styles.casillero}></div>
                    <div id="G4" className={styles.casillero}></div>
                    <div id="G5" className={styles.casillero}></div>
                    <div id="G6" className={styles.casillero}></div>
                    <div id="G7" className={styles.casillero}></div>
                    <div id="G8" className={styles.casillero}></div>
                    <div id="G9" className={styles.casillero}></div>
                    <div id="G10" className={styles.casillero}></div>
                </div>
                <div id="H">
                    <div id="H1" className={styles.casillero}></div>
                    <div id="H2" className={styles.casillero}></div>
                    <div id="H3" className={styles.casillero}></div>
                    <div id="H4" className={styles.casillero}></div>
                    <div id="H5" className={styles.casillero}></div>
                    <div id="H6" className={styles.casillero}></div>
                    <div id="H7" className={styles.casillero}></div>
                    <div id="H8" className={styles.casillero}></div>
                    <div id="H9" className={styles.casillero}></div>
                    <div id="H10" className={styles.casillero}></div>
                </div>
                <div id="I">
                    <div id="I1" className={styles.casillero}></div>
                    <div id="I2" className={styles.casillero}></div>
                    <div id="I3" className={styles.casillero}></div>
                    <div id="I4" className={styles.casillero}></div>
                    <div id="I5" className={styles.casillero}></div>
                    <div id="I6" className={styles.casillero}></div>
                    <div id="I7" className={styles.casillero}></div>
                    <div id="I8" className={styles.casillero}></div>
                    <div id="I9" className={styles.casillero}></div>
                    <div id="I10" className={styles.casillero}></div>
                </div>
                <div id="J">
                    <div id="J1" className={styles.casillero}></div>
                    <div id="J2" className={styles.casillero}></div>
                    <div id="J3" className={styles.casillero}></div>
                    <div id="J4" className={styles.casillero}></div>
                    <div id="J5" className={styles.casillero}></div>
                    <div id="J6" className={styles.casillero}></div>
                    <div id="J7" className={styles.casillero}></div>
                    <div id="J8" className={styles.casillero}></div>
                    <div id="J9" className={styles.casillero}></div>
                    <div id="J10" className={styles.casillero}></div>
                </div>
            </section>

        </>

    )
}

