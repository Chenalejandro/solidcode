<?php

function resolver(array &$matrix, array &$memo, int $fila, int $columna): int {
    if ($fila === 0 && $columna === 0) {
        return $matrix[0][0];
    }
    if ($memo[$fila][$columna] === null) {
        if ($fila === 0) {
            $memo[$fila][$columna] = resolver($matrix, $memo, $fila, $columna - 1) + $matrix[$fila][$columna];
        } else if ($columna === 0) {
            $memo[$fila][$columna] = resolver($matrix, $memo, $fila - 1, $columna) + $matrix[$fila][$columna];
        } else {
            $memo[$fila][$columna] = max(
                resolver($matrix, $memo, $fila, $columna - 1) + $matrix[$fila][$columna],
                resolver($matrix, $memo, $fila - 1, $columna) + $matrix[$fila][$columna]
            );
        }
    }
    return $memo[$fila][$columna];
}

function caminoDeMayorGanancia(array $matrix): int {
    $filas = count($matrix);
    $columnas = count($matrix[0]);
    $memo = array_fill(0, $filas, array_fill(0, $columnas, null));
    return resolver($matrix, $memo, $filas - 1, $columnas - 1);
}
