# ⚓ Batalla Naval - GRUPO 14 - 2025

**Batalla Naval** es un juego digital para **dos jugadores**, basado en el clásico juego de mesa.  
El objetivo es hundir todos los barcos del oponente antes de que él hunda los tuyos.

---

## Descripción general

Dos jugadores compiten entre sí en una partida por turnos.  
Cada uno coloca sus barcos en un tablero y por turnos, intenta adivinar las coordenadas de los barcos del rival disparando.

El sistema indica si el tiro fue **agua**, **tocado** o **hundido**, y el juego termina cuando uno de los jugadores logra destruir todos los barcos del otro.

---

## Funcionalidades principales

### Inicio del juego
- Dos jugadores ingresan sus nombres o usuarios.
- Se crea una nueva partida.
- Cada jugador obtiene su propio tablero.

### Preparación
- Cada jugador coloca sus barcos en un tablero (por ejemplo, 10x10).
- Los barcos pueden colocarse **horizontal o verticalmente**.
- El sistema **no permite superposiciones** entre barcos.

### Turnos
- El juego se desarrolla **por turnos**.
- En su turno, el jugador elige una **coordenada** del tablero rival para disparar.
- El sistema verifica:
  - Si hay barco → **impacto**.
  - Si no hay barco → **agua**.
- Cuando se impacta una coordenada:
  - Vuelve a jugar hasta a fallar

### Fin del juego
- Gana el jugador que **hunde todos los barcos** del oponente.
- El sistema muestra:
  - El **ganador**.

---

**Desarrollado por:** Ignacio Iglesias - Joaquin Peralta - Ignacio Salvadori - Dolores Solá  
Colegio Pío IX – 5° Informática 2025
