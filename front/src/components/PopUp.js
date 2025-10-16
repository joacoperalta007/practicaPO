'use client'
import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import styles from '@/components/PopUp.module.css'

const PopUp = ({isError = false, isMessage = false, children}) => {

    return <Popup trigger={<button className={styles.boton}>Crear partida</button>} position="right center">
        <div>{children}</div>
    </Popup>
}



export default PopUp;