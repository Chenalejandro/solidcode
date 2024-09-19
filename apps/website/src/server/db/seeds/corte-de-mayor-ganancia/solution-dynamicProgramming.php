<?php

function aux(array &$precios, array &$memo, int $longitudActual): int {
  if ($longitudActual == 0) {
    return 0;
  }
  if ($memo[$longitudActual] == null) {
    $memo[$longitudActual] = 0;
    for ($i = 1; $i <= $longitudActual; $i++) {
      $indiceReal = $i - 1;
      $memo[$longitudActual] = max($memo[$longitudActual], $precios[$indiceReal] + aux($precios, $memo, $longitudActual - $i));
    }
  }
  return $memo[$longitudActual];
}

function corteDeMayorGanancia(array $precios, int $longitud): int {
  $memo = array_fill(0, $longitud + 1, null);
  return aux($precios, $memo, $longitud);
}
