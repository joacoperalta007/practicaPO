"use client"
import styles from "./Mensaje.module.css";
export default function Mensajes(props){
    return(
        <>
            <div className={styles.div}>
                <p className={styles.p}>{props.texto}</p>
            </div>
        </>
    )
}