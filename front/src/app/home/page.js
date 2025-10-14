"use client"

import { useState } from "react";
import Button from "@/components/Boton";
import Input from "@/components/Input";
import { useSearchParams } from "next/navigation";
import styles from "@/app/home/page.module.css"

export default function Login() {

    const searchParams = useSearchParams();
    const usuario = searchParams.get("user");
    const idLogged = searchParams.get("idLogged");

    return (

        <>

            <div className={styles.header}>
                <h1>¡Bienvenido {usuario} a Batalla naval! </h1>

            </div>


        </>

    )

}