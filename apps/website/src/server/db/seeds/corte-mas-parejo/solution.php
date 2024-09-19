<?php

function corteMasParejo(array $array): int {
  $result = [];
  for ($i = 0; $i < count($array); $i++) {
    $corteIzq = array_slice($array, 0, $i);
    $corteDer = array_slice($array, $i);
    $sumIzq = array_sum($corteIzq);
    $sumDer = array_sum($corteDer);
    $result[] = abs($sumIzq - $sumDer);
  }
  return min($result);
}
