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
    const idPartida = searchParams.get("idPartida")
    const idLogged = searchParams.get("idLogged")

    const esJugador1 = Number(idLogged) === Number(id1);

    return (
        <>
            <section className={styles.header}>
                <h1>Numero de partida:  {idPartida}</h1>
            </section>
            <section className={styles.juego}>
                {/* Tablero del jugador loggeado (izquierda) */}
                <div className={styles.tableroContainer}>
                    <div className={styles.encabezadoTablero}>
                        <img src={esJugador1 ? img1 : img2} className={styles.imgPerfil} alt="Mi avatar" />
                        <div className={styles.nombre}>
                            <h2>{esJugador1 ? nombre1 : nombre2}</h2>
                            <p>Mi tablero</p>
                        </div>

                    </div>
                    <div className={styles.tablero}>
                        <div className={styles.fila}>
                            <div id="A1" className={styles.casillero}><button></button></div>
                            <div id="A2" className={styles.casillero}><button></button></div>
                            <div id="A3" className={styles.casillero}><button></button></div>
                            <div id="A4" className={styles.casillero}><button></button></div>
                            <div id="A5" className={styles.casillero}><button></button></div>
                            <div id="A6" className={styles.casillero}><button></button></div>
                            <div id="A7" className={styles.casillero}><button></button></div>
                            <div id="A8" className={styles.casillero}><button></button></div>
                            <div id="A9" className={styles.casillero}><button></button></div>
                            <div id="A10" className={styles.casillero}><button></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div id="B1" className={styles.casillero}><button></button></div>
                            <div id="B2" className={styles.casillero}><button></button></div>
                            <div id="B3" className={styles.casillero}><button></button></div>
                            <div id="B4" className={styles.casillero}><button></button></div>
                            <div id="B5" className={styles.casillero}><button></button></div>
                            <div id="B6" className={styles.casillero}><button></button></div>
                            <div id="B7" className={styles.casillero}><button></button></div>
                            <div id="B8" className={styles.casillero}><button></button></div>
                            <div id="B9" className={styles.casillero}><button></button></div>
                            <div id="B10" className={styles.casillero}><button></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div id="C1" className={styles.casillero}><button></button></div>
                            <div id="C2" className={styles.casillero}><button></button></div>
                            <div id="C3" className={styles.casillero}><button></button></div>
                            <div id="C4" className={styles.casillero}><button></button></div>
                            <div id="C5" className={styles.casillero}><button></button></div>
                            <div id="C6" className={styles.casillero}><button></button></div>
                            <div id="C7" className={styles.casillero}><button></button></div>
                            <div id="C8" className={styles.casillero}><button></button></div>
                            <div id="C9" className={styles.casillero}><button></button></div>
                            <div id="C10" className={styles.casillero}><button></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div id="D1" className={styles.casillero}><button></button></div>
                            <div id="D2" className={styles.casillero}><button></button></div>
                            <div id="D3" className={styles.casillero}><button></button></div>
                            <div id="D4" className={styles.casillero}><button></button></div>
                            <div id="D5" className={styles.casillero}><button></button></div>
                            <div id="D6" className={styles.casillero}><button></button></div>
                            <div id="D7" className={styles.casillero}><button></button></div>
                            <div id="D8" className={styles.casillero}><button></button></div>
                            <div id="D9" className={styles.casillero}><button></button></div>
                            <div id="D10" className={styles.casillero}><button></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div id="E1" className={styles.casillero}><button></button></div>
                            <div id="E2" className={styles.casillero}><button></button></div>
                            <div id="E3" className={styles.casillero}><button></button></div>
                            <div id="E4" className={styles.casillero}><button></button></div>
                            <div id="E5" className={styles.casillero}><button></button></div>
                            <div id="E6" className={styles.casillero}><button></button></div>
                            <div id="E7" className={styles.casillero}><button></button></div>
                            <div id="E8" className={styles.casillero}><button></button></div>
                            <div id="E9" className={styles.casillero}><button></button></div>
                            <div id="E10" className={styles.casillero}><button></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div id="F1" className={styles.casillero}><button></button></div>
                            <div id="F2" className={styles.casillero}><button></button></div>
                            <div id="F3" className={styles.casillero}><button></button></div>
                            <div id="F4" className={styles.casillero}><button></button></div>
                            <div id="F5" className={styles.casillero}><button></button></div>
                            <div id="F6" className={styles.casillero}><button></button></div>
                            <div id="F7" className={styles.casillero}><button></button></div>
                            <div id="F8" className={styles.casillero}><button></button></div>
                            <div id="F9" className={styles.casillero}><button></button></div>
                            <div id="F10" className={styles.casillero}><button></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div id="G1" className={styles.casillero}><button></button></div>
                            <div id="G2" className={styles.casillero}><button></button></div>
                            <div id="G3" className={styles.casillero}><button></button></div>
                            <div id="G4" className={styles.casillero}><button></button></div>
                            <div id="G5" className={styles.casillero}><button></button></div>
                            <div id="G6" className={styles.casillero}><button></button></div>
                            <div id="G7" className={styles.casillero}><button></button></div>
                            <div id="G8" className={styles.casillero}><button></button></div>
                            <div id="G9" className={styles.casillero}><button></button></div>
                            <div id="G10" className={styles.casillero}><button></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div id="H1" className={styles.casillero}><button></button></div>
                            <div id="H2" className={styles.casillero}><button></button></div>
                            <div id="H3" className={styles.casillero}><button></button></div>
                            <div id="H4" className={styles.casillero}><button></button></div>
                            <div id="H5" className={styles.casillero}><button></button></div>
                            <div id="H6" className={styles.casillero}><button></button></div>
                            <div id="H7" className={styles.casillero}><button></button></div>
                            <div id="H8" className={styles.casillero}><button></button></div>
                            <div id="H9" className={styles.casillero}><button></button></div>
                            <div id="H10" className={styles.casillero}><button></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div id="I1" className={styles.casillero}><button></button></div>
                            <div id="I2" className={styles.casillero}><button></button></div>
                            <div id="I3" className={styles.casillero}><button></button></div>
                            <div id="I4" className={styles.casillero}><button></button></div>
                            <div id="I5" className={styles.casillero}><button></button></div>
                            <div id="I6" className={styles.casillero}><button></button></div>
                            <div id="I7" className={styles.casillero}><button></button></div>
                            <div id="I8" className={styles.casillero}><button></button></div>
                            <div id="I9" className={styles.casillero}><button></button></div>
                            <div id="I10" className={styles.casillero}><button></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div id="J1" className={styles.casillero}><button></button></div>
                            <div id="J2" className={styles.casillero}><button></button></div>
                            <div id="J3" className={styles.casillero}><button></button></div>
                            <div id="J4" className={styles.casillero}><button></button></div>
                            <div id="J5" className={styles.casillero}><button></button></div>
                            <div id="J6" className={styles.casillero}><button></button></div>
                            <div id="J7" className={styles.casillero}><button></button></div>
                            <div id="J8" className={styles.casillero}><button></button></div>
                            <div id="J9" className={styles.casillero}><button></button></div>
                            <div id="J10" className={styles.casillero}><button></button></div>
                        </div>
                    </div>
                </div>

                {/* Tablero del oponente (derecha) */}
                <div className={styles.tableroContainer}>
                    <div className={styles.encabezadoTablero}>
                        <img src={esJugador1 ? img2 : img1} className={styles.imgPerfil} alt="Avatar oponente" />
                        <div className={styles.nombre}>
                            <h2>{esJugador1 ? nombre2 : nombre1}</h2>
                            <p>Tablero enemigo</p>
                        </div>

                    </div>
                    <div className={styles.tablero}>
                        <div className={styles.fila}>
                            <div id="A1-enemy" className={styles.casillero}><button></button></div>
                            <div id="A2-enemy" className={styles.casillero}><button></button></div>
                            <div id="A3-enemy" className={styles.casillero}><button></button></div>
                            <div id="A4-enemy" className={styles.casillero}><button></button></div>
                            <div id="A5-enemy" className={styles.casillero}><button></button></div>
                            <div id="A6-enemy" className={styles.casillero}><button></button></div>
                            <div id="A7-enemy" className={styles.casillero}><button></button></div>
                            <div id="A8-enemy" className={styles.casillero}><button></button></div>
                            <div id="A9-enemy" className={styles.casillero}><button></button></div>
                            <div id="A10-enemy" className={styles.casillero}><button></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div id="B1-enemy" className={styles.casillero}><button></button></div>
                            <div id="B2-enemy" className={styles.casillero}><button></button></div>
                            <div id="B3-enemy" className={styles.casillero}><button></button></div>
                            <div id="B4-enemy" className={styles.casillero}><button></button></div>
                            <div id="B5-enemy" className={styles.casillero}><button></button></div>
                            <div id="B6-enemy" className={styles.casillero}><button></button></div>
                            <div id="B7-enemy" className={styles.casillero}><button></button></div>
                            <div id="B8-enemy" className={styles.casillero}><button></button></div>
                            <div id="B9-enemy" className={styles.casillero}><button></button></div>
                            <div id="B10-enemy" className={styles.casillero}><button></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div id="C1-enemy" className={styles.casillero}><button></button></div>
                            <div id="C2-enemy" className={styles.casillero}><button></button></div>
                            <div id="C3-enemy" className={styles.casillero}><button></button></div>
                            <div id="C4-enemy" className={styles.casillero}><button></button></div>
                            <div id="C5-enemy" className={styles.casillero}><button></button></div>
                            <div id="C6-enemy" className={styles.casillero}><button></button></div>
                            <div id="C7-enemy" className={styles.casillero}><button></button></div>
                            <div id="C8-enemy" className={styles.casillero}><button></button></div>
                            <div id="C9-enemy" className={styles.casillero}><button></button></div>
                            <div id="C10-enemy" className={styles.casillero}><button></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div id="D1-enemy" className={styles.casillero}><button></button></div>
                            <div id="D2-enemy" className={styles.casillero}><button></button></div>
                            <div id="D3-enemy" className={styles.casillero}><button></button></div>
                            <div id="D4-enemy" className={styles.casillero}><button></button></div>
                            <div id="D5-enemy" className={styles.casillero}><button></button></div>
                            <div id="D6-enemy" className={styles.casillero}><button></button></div>
                            <div id="D7-enemy" className={styles.casillero}><button></button></div>
                            <div id="D8-enemy" className={styles.casillero}><button></button></div>
                            <div id="D9-enemy" className={styles.casillero}><button></button></div>
                            <div id="D10-enemy" className={styles.casillero}><button></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div id="E1-enemy" className={styles.casillero}><button></button></div>
                            <div id="E2-enemy" className={styles.casillero}><button></button></div>
                            <div id="E3-enemy" className={styles.casillero}><button></button></div>
                            <div id="E4-enemy" className={styles.casillero}><button></button></div>
                            <div id="E5-enemy" className={styles.casillero}><button></button></div>
                            <div id="E6-enemy" className={styles.casillero}><button></button></div>
                            <div id="E7-enemy" className={styles.casillero}><button></button></div>
                            <div id="E8-enemy" className={styles.casillero}><button></button></div>
                            <div id="E9-enemy" className={styles.casillero}><button></button></div>
                            <div id="E10-enemy" className={styles.casillero}><button></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div id="F1-enemy" className={styles.casillero}><button></button></div>
                            <div id="F2-enemy" className={styles.casillero}><button></button></div>
                            <div id="F3-enemy" className={styles.casillero}><button></button></div>
                            <div id="F4-enemy" className={styles.casillero}><button></button></div>
                            <div id="F5-enemy" className={styles.casillero}><button></button></div>
                            <div id="F6-enemy" className={styles.casillero}><button></button></div>
                            <div id="F7-enemy" className={styles.casillero}><button></button></div>
                            <div id="F8-enemy" className={styles.casillero}><button></button></div>
                            <div id="F9-enemy" className={styles.casillero}><button></button></div>
                            <div id="F10-enemy" className={styles.casillero}><button></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div id="G1-enemy" className={styles.casillero}><button></button></div>
                            <div id="G2-enemy" className={styles.casillero}><button></button></div>
                            <div id="G3-enemy" className={styles.casillero}><button></button></div>
                            <div id="G4-enemy" className={styles.casillero}><button></button></div>
                            <div id="G5-enemy" className={styles.casillero}><button></button></div>
                            <div id="G6-enemy" className={styles.casillero}><button></button></div>
                            <div id="G7-enemy" className={styles.casillero}><button></button></div>
                            <div id="G8-enemy" className={styles.casillero}><button></button></div>
                            <div id="G9-enemy" className={styles.casillero}><button></button></div>
                            <div id="G10-enemy" className={styles.casillero}><button></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div id="H1-enemy" className={styles.casillero}><button></button></div>
                            <div id="H2-enemy" className={styles.casillero}><button></button></div>
                            <div id="H3-enemy" className={styles.casillero}><button></button></div>
                            <div id="H4-enemy" className={styles.casillero}><button></button></div>
                            <div id="H5-enemy" className={styles.casillero}><button></button></div>
                            <div id="H6-enemy" className={styles.casillero}><button></button></div>
                            <div id="H7-enemy" className={styles.casillero}><button></button></div>
                            <div id="H8-enemy" className={styles.casillero}><button></button></div>
                            <div id="H9-enemy" className={styles.casillero}><button></button></div>
                            <div id="H10-enemy" className={styles.casillero}><button></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div id="I1-enemy" className={styles.casillero}><button></button></div>
                            <div id="I2-enemy" className={styles.casillero}><button></button></div>
                            <div id="I3-enemy" className={styles.casillero}><button></button></div>
                            <div id="I4-enemy" className={styles.casillero}><button></button></div>
                            <div id="I5-enemy" className={styles.casillero}><button></button></div>
                            <div id="I6-enemy" className={styles.casillero}><button></button></div>
                            <div id="I7-enemy" className={styles.casillero}><button></button></div>
                            <div id="I8-enemy" className={styles.casillero}><button></button></div>
                            <div id="I9-enemy" className={styles.casillero}><button></button></div>
                            <div id="I10-enemy" className={styles.casillero}><button></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div id="J1-enemy" className={styles.casillero}><button></button></div>
                            <div id="J2-enemy" className={styles.casillero}><button></button></div>
                            <div id="J3-enemy" className={styles.casillero}><button></button></div>
                            <div id="J4-enemy" className={styles.casillero}><button></button></div>
                            <div id="J5-enemy" className={styles.casillero}><button></button></div>
                            <div id="J6-enemy" className={styles.casillero}><button></button></div>
                            <div id="J7-enemy" className={styles.casillero}><button></button></div>
                            <div id="J8-enemy" className={styles.casillero}><button></button></div>
                            <div id="J9-enemy" className={styles.casillero}><button></button></div>
                            <div id="J10-enemy" className={styles.casillero}><button></button></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}