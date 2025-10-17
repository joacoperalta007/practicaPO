'use client'
import {useEffect, useState} from "react";
import { useSearchParams } from "next/navigation";

export default function pagina(){

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
    return(

        <>
            <h1>XD</h1>
        
        </>

    )
}

