'use client'
import {useEffect, useState} from "react";
import { useSearchParams } from "next/navigation";

export default function pagina(){
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
    return(

        <>
            <h1>Partida número: {idPartida}</h1>
            <h2>Jugador 1: {nombre1} ID: {id1}</h2>
            <h2>Jugador 2: {nombre2} ID: {id2}</h2>
            <label>Imagen jugador 1:</label>
            <img src={img1}></img>
            <label>Imagen jugador 2:</label>
            <img src={img2}></img>
        
        </>

    )
}

