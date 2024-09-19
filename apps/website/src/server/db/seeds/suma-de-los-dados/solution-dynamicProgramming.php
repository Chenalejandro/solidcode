<?php

function sumaDeLosDados(int $cantDados, int $cantCaras, int $sumaRequerida): int {
    $rows = $cantDados + 1;
    $columns = $sumaRequerida + 1;
    $matrix = array_fill(0, $rows, array_fill(0, $columns, null));
    return sumaParcial($matrix, $cantCaras, $cantDados, $sumaRequerida);
}

function sumaParcial(array &$matrix, int $cantCaras, int $cantDados, int $sumaRequerida): int {
    if ($cantDados == 1) {
        if ($sumaRequerida >= 1 && $sumaRequerida <= $cantCaras) {
            return 1;
        }
        return 0;
    }
    if ($matrix[$cantDados][$sumaRequerida] == null) {
        $suma = 0;
        $minimo = min($cantCaras, $sumaRequerida);
        for ($i = 1; $i <= $minimo; $i++) {
            $suma += sumaParcial($matrix, $cantCaras, $cantDados - 1, $sumaRequerida - $i);
        }
        $matrix[$cantDados][$sumaRequerida] = $suma;
    }
    return $matrix[$cantDados][$sumaRequerida];
}
