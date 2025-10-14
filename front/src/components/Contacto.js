"use client"
import styles from "./Cotacto.module.css";
export default function Contacto(props) {
    return (
    <>
        <div className={styles.contenedor}>
            <img src={props.src} className={styles.imagen}></img>
            <div className={styles.texto}>
                <h2>{props.contacto}</h2>
                <p>{props.descripcion}</p>
            </div>
        </div>
    </>
    )
}