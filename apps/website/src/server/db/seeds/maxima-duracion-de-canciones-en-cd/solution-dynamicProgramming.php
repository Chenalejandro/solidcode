<?php

function maximaDuracionDeCancionesEnCd(array $duraciones, int $capacidad): int {
    $rows = count($duraciones) + 1;
    $columns = $capacidad + 1;
    $matrix = array_fill(0, $rows, array_fill(0, $columns, null));
    return aux($matrix, $duraciones, $capacidad, count($duraciones));
}

function aux(array &$matrix, array &$duraciones, int $capacidadRestante, int $indice) {
    if ($indice === 0) {
        return 0;
    }

    $indiceReal = $indice - 1;
    if ($matrix[$indice][$capacidadRestante] === null) {
        if ($duraciones[$indiceReal] > $capacidadRestante) {
            $matrix[$indice][$capacidadRestante] = aux($matrix, $duraciones, $capacidadRestante, $indice - 1);
        } else {
            $matrix[$indice][$capacidadRestante] = max(
                aux($matrix, $duraciones, $capacidadRestante - $duraciones[$indiceReal], $indice - 1) + $duraciones[$indiceReal],
                aux($matrix, $duraciones, $capacidadRestante, $indice - 1)
            );
        }
    }
    return $matrix[$indice][$capacidadRestante];
}
