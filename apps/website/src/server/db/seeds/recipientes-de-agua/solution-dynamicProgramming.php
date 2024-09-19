<?php

function recipienteDeAgua(array $capacidadRecipientes, int $capacidadBalde1, int $capacidadBalde2): int {
    $sumaAcumulada = array_fill(0, count($capacidadRecipientes) + 1, 0);
    for ($i = 1; $i < count($sumaAcumulada); $i++) {
        $sumaAcumulada[$i] = $sumaAcumulada[$i - 1] + $capacidadRecipientes[$i - 1];
    }

    $rows = count($capacidadRecipientes);
    $columns = $capacidadBalde1 + 1;
    $matrix = array_fill(0, $rows, array_fill(0, $columns, null));

    $capacidadTotal = $capacidadBalde1 + $capacidadBalde2;

    return aux($matrix, $capacidadRecipientes, $sumaAcumulada, $capacidadTotal, 0, $capacidadBalde1);
}

function aux(array &$matrix, array $capacidadRecipientes, array $sumaAcumulada, int $capacidadTotal, int $indice, int $capacidadRemanenteBalde1): int {
    $capacidadRemanenteTotal = $capacidadTotal - $sumaAcumulada[$indice];
    $capacidadRemanenteBalde2 = $capacidadRemanenteTotal - $capacidadRemanenteBalde1;
    if ($indice === count($capacidadRecipientes) - 1) {
        if ($capacidadRemanenteBalde1 >= $capacidadRecipientes[$indice] || $capacidadRemanenteBalde2 >= $capacidadRecipientes[$indice]) {
            return $indice + 1;
        }
        return $indice;
    }

    if ($matrix[$indice][$capacidadRemanenteBalde1] === null) {
        if ($capacidadRemanenteBalde1 < $capacidadRecipientes[$indice] && $capacidadRemanenteBalde2 < $capacidadRecipientes[$indice]) {
            $matrix[$indice][$capacidadRemanenteBalde1] = $indice;
        } else if ($capacidadRemanenteBalde1 >= $capacidadRecipientes[$indice] && $capacidadRemanenteBalde2 >= $capacidadRecipientes[$indice]) {
            $matrix[$indice][$capacidadRemanenteBalde1] = max(
                aux($matrix, $capacidadRecipientes, $sumaAcumulada, $capacidadTotal, $indice + 1, $capacidadRemanenteBalde1 - $capacidadRecipientes[$indice]),
                aux($matrix, $capacidadRecipientes, $sumaAcumulada, $capacidadTotal, $indice + 1, $capacidadRemanenteBalde1)
            );
        } else if ($capacidadRemanenteBalde1 >= $capacidadRecipientes[$indice]) {
            $matrix[$indice][$capacidadRemanenteBalde1] = aux($matrix, $capacidadRecipientes, $sumaAcumulada, $capacidadTotal, $indice + 1, $capacidadRemanenteBalde1 - $capacidadRecipientes[$indice]);
        } else {
            $matrix[$indice][$capacidadRemanenteBalde1] = aux($matrix, $capacidadRecipientes, $sumaAcumulada, $capacidadTotal, $indice + 1, $capacidadRemanenteBalde1);
        }
    }
    return $matrix[$indice][$capacidadRemanenteBalde1];
}
