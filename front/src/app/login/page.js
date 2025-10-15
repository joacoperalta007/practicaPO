"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Boton";
import Input from "@/components/Input";
import styles from "./page.module.css";

export default function Login() {
  const router = useRouter();
  const [contraseña, setContraseña] = useState("");
  const [nombre, setNombre] = useState("");
  const [user, setUser] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [mail, setMail] = useState("");

  async function login() {
    const data = { user, contraseña };

    fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.res) {
          alert("Ingresaste con éxito");
          router.push(`/home?idLogged=${response.idLogged}&user=${response.user}`);
        } else {
          alert("Usuario o contraseña incorrectos");
        }
      });
  }

  async function register() {
    const data = { nombre, contraseña, email: mail, user };

    fetch("http://localhost:4000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.res) {
          alert("Cuenta creada con éxito");
          router.push(`/home?idLogged=${response.idLogged}&user=${user}`);
        } else {
          alert("El usuario ya existe");
        }
      });
  }

  return (
    <>
      <div className={styles.contenedor}>
        <h2>Iniciar sesión</h2>
        <br />
        <h3>Ingrese su nombre de usuario: </h3>
        <Input onChange={(e) => setUser(e.target.value)} />
        <br />
        <br />
        <h3>Ingrese su contraseña: </h3>
        <Input type="password" onChange={(e) => setContraseña(e.target.value)} />
        <Button onClick={login} text="Iniciar sesión" />
        <br />
        <br />
        <h3>¿No tenés cuenta? ¡Registrate ahora!</h3>
        <br />
        <Button onClick={() => setMostrar(!mostrar)} text="Ir a registrarse" />
      </div>

      {mostrar && (
        <div className={styles.contenedor}>
          <h2>Registrarse</h2>
          <br />
          <h3>Ingrese su nombre:</h3>
          <Input onChange={(e) => setNombre(e.target.value)} />
          <br />
          <br />
          <h3>Ingrese su nombre de usuario:</h3>
          <Input onChange={(e) => setUser(e.target.value)} />
          <br />
          <br />
          <h3>Ingrese su email:</h3>
          <Input onChange={(e) => setMail(e.target.value)} />
          <br />
          <br />
          <h3>Ingrese su contraseña:</h3>
          <Input type="password" onChange={(e) => setContraseña(e.target.value)} />
          <br />
          <br />
          <Button onClick={register} text="Registrarse" />
        </div>
      )}
    </>
  );
}
