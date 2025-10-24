'use client'
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSocket } from "../hooks/useSocket";
import Image from 'next/image';
import PopUp from "@/components/PopUp";
import styles from "@/app/partida/page.module.css"

const coordenadasUtilizadas = [] // aca se van pushenado las cordenadas usadas x todoslos barcos de tu tablero
const destructor1 = 2;
const destructor2 = 2;
const crucero = 3;
const acorazado = 4;
const portaAviones = 5;
const coordDestructor1 = []
const coordDestructor2 = []
const coordCrucero = []
const coordAcorazado = []
const coordPortaAviones = [] //aca se pushean las coordeanadas cuandop ubicas tus barcos
//se comparan entre el length de los barcos y el array de las
//coordenadas, para saber cuando termine de seleccionar los 
//casilleros de un barco y asi aparece la imagen en pantalla 

const matriz = [
    ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"],
    ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
    ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10"],
    ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10"],
    ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "E10"],
    ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10"],
    ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10"],
    ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10"],
    ["I1", "I2", "I3", "I4", "I5", "I6", "I7", "I8", "I9", "I10"],
    ["J1", "J2", "J3", "J4", "J5", "J6", "J7", "J8", "J9", "J10"]
];
const barraBarcos = [
    "/imagenes/destructorV.png",
    "/imagenes/destructorV.png",
    "/imagenes/cruceroV.png",
    "/imagenes/acorazadoV.png",
    "/imagenes/portaAvionesV.png"
]

/*const barcosOrientados = {
    destructor1V : ,
    destructor2V: ,
    cruceroV: , 
    acorazadoV: ,
    portaavionesV: ,
    destructor1H : ,
    destructor2H: ,
    cruceroH: , 
    acorazadoH: ,
    portaavionesH: 
}*/ //COMPLETAR CON LAS DIRECCIONES DE LAS IMAGENES DE BARCOS HORIZONTALES Y VERTICALES

export default function pagina() {
    const { socket, isConnected } = useSocket();
    const searchParams = useSearchParams();
    const nombre1 = searchParams.get("jugador1Nombre");
    const nombre2 = searchParams.get("jugador2Nombre");
    const id1 = searchParams.get("jugador1Id");
    const id2 = searchParams.get("jugador2Id");
    const img1 = searchParams.get("img1");
    const img2 = searchParams.get("img2");
    const idPartida = searchParams.get("idPartida");
    const idLogged = searchParams.get("idLogged");
    const [selectedCasilla, setSelectedCasilla] = useState("");
    const [selectedCasillaEnemy, setSelectedCasillaEnemy] = useState("");
    const [orientacion, setOrientacion] = useState("horizontal");
    const [selectedBarco, setSelectedBarco] = useState(null)

    const esJugador1 = Number(idLogged) === Number(id1);

    function obtenerCasilla(e) {
        const id = e.target.id;
        setSelectedCasilla(id)
        console.log(id); // A1, B2, etc.
        // hacer algo con el id
    }

    function obtenerCasillaEnemy(e) {
        const id = e.target.id;
        setSelectedCasillaEnemy(id)
        console.log(id, " enemigo"); // A1-enemy, B2-enemy, etc.
        // hacer algo con el id
    }
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
                            <div className={styles.casillero}><button id="A1" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="A2" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="A3" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="A4" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="A5" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="A6" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="A7" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="A8" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="A9" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="A10" onClick={obtenerCasilla}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="B1" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="B2" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="B3" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="B4" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="B5" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="B6" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="B7" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="B8" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="B9" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="B10" onClick={obtenerCasilla}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="C1" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="C2" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="C3" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="C4" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="C5" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="C6" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="C7" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="C8" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="C9" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="C10" onClick={obtenerCasilla}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="D1" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="D2" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="D3" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="D4" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="D5" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="D6" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="D7" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="D8" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="D9" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="D10" onClick={obtenerCasilla}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="E1" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="E2" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="E3" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="E4" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="E5" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="E6" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="E7" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="E8" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="E9" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="E10" onClick={obtenerCasilla}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="F1" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="F2" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="F3" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="F4" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="F5" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="F6" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="F7" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="F8" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="F9" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="F10" onClick={obtenerCasilla}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="G1" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="G2" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="G3" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="G4" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="G5" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="G6" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="G7" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="G8" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="G9" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="G10" onClick={obtenerCasilla}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="H1" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="H2" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="H3" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="H4" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="H5" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="H6" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="H7" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="H8" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="H9" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="H10" onClick={obtenerCasilla}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="I1" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="I2" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="I3" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="I4" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="I5" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="I6" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="I7" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="I8" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="I9" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="I10" onClick={obtenerCasilla}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="J1" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="J2" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="J3" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="J4" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="J5" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="J6" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="J7" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="J8" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="J9" onClick={obtenerCasilla}></button></div>
                            <div className={styles.casillero}><button id="J10" onClick={obtenerCasilla}></button></div>
                        </div>
                    </div>
                </div>
                <div id="barcos" className={styles.barcosContainer}>
                    {barraBarcos.map((barco, index) => (
                        <button
                            className={selectedBarco === index ? styles.botonBarcoSeleccionado : styles.botonBarco}
                            key={index}
                            onClick={() => setSelectedBarco(index)} // Guarda el índice
                        >
                            <img
                                src={barco}
                                alt={`barco ${index}`}
                            />
                        </button>
                    ))}
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
                            <div className={styles.casillero}><button id="A1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="A2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="A3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="A4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="A5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="A6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="A7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="A8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="A9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="A10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="B1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="B2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="B3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="B4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="B5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="B6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="B7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="B8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="B9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="B10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="C1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="C2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="C3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="C4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="C5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="C6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="C7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="C8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="C9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="C10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="D1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="D2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="D3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="D4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="D5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="D6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="D7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="D8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="D9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="D10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="E1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="E2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="E3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="E4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="E5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="E6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="E7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="E8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="E9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="E10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="F1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="F2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="F3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="F4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="F5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="F6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="F7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="F8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="F9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="F10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="G1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="G2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="G3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="G4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="G5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="G6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="G7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="G8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="G9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="G10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="H1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="H2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="H3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="H4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="H5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="H6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="H7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="H8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="H9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="H10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="I1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="I2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="I3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="I4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="I5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="I6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="I7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="I8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="I9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="I10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                        <div className={styles.fila}>
                            <div className={styles.casillero}><button id="J1" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="J2" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="J3" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="J4" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="J5" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="J6" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="J7" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="J8" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="J9" onClick={obtenerCasillaEnemy}></button></div>
                            <div className={styles.casillero}><button id="J10" onClick={obtenerCasillaEnemy}></button></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
