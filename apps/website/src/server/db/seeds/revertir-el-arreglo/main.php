<?php
/*
 * Completar la función 'revertir' de acá abajo.
 *
 * Esta función retorna un arreglo de números.
 */

function revertir(array $ar): array {
    $result = [];
    $arraySize = count($ar);
    for ($i = $arraySize - 1; $i >= 0; $i--) {
        $result[] = $ar[$i];
    }
    return $result;
}
