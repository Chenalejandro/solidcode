<?php

function maximaDuracionDeCancionesEnCd(array $duraciones, int $capacidad): int {
    $rows = count($duraciones);
    $columns = $capacidad + 1;
    $matrix = array_fill(0, $rows, array_fill(0, $columns, null));
    return aux($matrix, $duraciones, $capacidad, 0);
}

function aux(array &$matrix, array &$duraciones, int $capacidadRestante, int $indice) {
    if ($indice === count($duraciones)) {
        return 0;
    }

    if ($matrix[$indice][$capacidadRestante] === null) {
        if ($duraciones[$indice] > $capacidadRestante) {
            $matrix[$indice][$capacidadRestante] = aux($matrix, $duraciones, $capacidadRestante, $indice + 1);
        } else {
            $matrix[$indice][$capacidadRestante] = max(
                aux($matrix, $duraciones, $capacidadRestante - $duraciones[$indice], $indice + 1) + $duraciones[$indice],
                aux($matrix, $duraciones, $capacidadRestante, $indice + 1)
            );
        }
    }
    return $matrix[$indice][$capacidadRestante];
}
