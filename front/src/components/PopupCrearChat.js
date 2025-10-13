import { useState } from 'react';
import styles from './PopupCrearChat.module.css';

export default function PopupCrearChat({ isOpen, onClose, onCrearChat, idLogged }) {
    const [esGrupo, setEsGrupo] = useState(false);
    const [nombreGrupo, setNombreGrupo] = useState('');
    const [telefonoInput, setTelefonoInput] = useState('');
    const [telefonos, setTelefonos] = useState([]);

    if (!isOpen) return null;

    const agregarTelefono = () => {
        if (telefonoInput.trim() && !telefonos.includes(telefonoInput.trim())) {
            setTelefonos([...telefonos, telefonoInput.trim()]);
            setTelefonoInput('');
        }
    };

    const eliminarTelefono = (tel) => {
        setTelefonos(telefonos.filter(t => t !== tel));
    };

    const handleSubmit = async () => {
        if (telefonos.length === 0) {
            alert('Debes agregar al menos un número de teléfono');
            return;
        }

        if (esGrupo && !nombreGrupo.trim()) {
            alert('Debes ingresar un nombre para el grupo');
            return;
        }

        await onCrearChat({
            es_grupo: esGrupo ? 1 : 0,
            nombre_grupo: esGrupo ? nombreGrupo : null,
            foto_grupo: null,
            descripcion: null,
            telefonos: telefonos,
            idLogged: idLogged
        });

        setEsGrupo(false);
        setNombreGrupo('');
        setTelefonoInput('');
        setTelefonos([]);
        onClose();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            agregarTelefono();
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Crear Nuevo Chat</h2>
                    <button onClick={onClose} className={styles.closeBtn}>✕</button>
                </div>

                <div className={styles.content}>
                    <div className={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            id="esGrupo"
                            checked={esGrupo}
                            onChange={(e) => setEsGrupo(e.target.checked)}
                            className={styles.checkbox}
                        />
                        <label htmlFor="esGrupo" className={styles.label}>
                            Es un grupo
                        </label>
                    </div>

                    {esGrupo && (
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Nombre del grupo:</label>
                            <input
                                type="text"
                                value={nombreGrupo}
                                onChange={(e) => setNombreGrupo(e.target.value)}
                                placeholder="Ej: Grupo de trabajo..."
                                className={styles.input}
                            />
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Números de teléfono:</label>
                        <div className={styles.telefonoInputContainer}>
                            <input
                                type="text"
                                value={telefonoInput}
                                onChange={(e) => setTelefonoInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ingresa un número"
                                className={styles.input}
                            />
                            <button onClick={agregarTelefono} className={styles.addBtn}>
                                Agregar
                            </button>
                        </div>
                    </div>

                    {telefonos.length > 0 && (
                        <div className={styles.telefonosList}>
                            <p className={styles.label}>Números agregados:</p>
                            {telefonos.map((tel, index) => (
                                <div key={index} className={styles.telefonoChip}>
                                    <span>{tel}</span>
                                    <button
                                        onClick={() => eliminarTelefono(tel)}
                                        className={styles.removeBtn}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <button onClick={onClose} className={styles.cancelBtn}>
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} className={styles.submitBtn}>
                        Crear Chat
                    </button>
                </div>
            </div>
        </div>
    );
}