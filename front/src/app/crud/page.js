"use client"

import Button from "@/components/Boton";
import Input from "@/components/Input";
import { useState } from "react";


export default function Crud() {
    const [nombre, setNombre] = useState("")
    const [id, setId] = useState(0)

    function cambiarNombre() {
    let data = {
      nombre: nombre,
      id_jugador: id
    };
    console.log(data)
    fetch("http://localhost:4000/cambiarNombre", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.res) {
          console.log(response);
          alert("Cambiado con exito");
        }
      });
    }

    function guardarNombre(event) {
        setNombre(event.target.value);
    }

    function guardarId(event) {
        setId(event.target.value);
    }

    return (
        <>
            <Input onChange={guardarNombre}></Input>
            <Input onChange={guardarId}></Input>
            <Button onClick={cambiarNombre} text="gola"></Button>
        </>
    )
}