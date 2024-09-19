<?php

$result = [];

function recorridoDeArbolBinarioEnOrden(?Nodo $raiz): array {
  global $result;
  $result = [];
  enOrden($raiz);
  return $result;
}

function enOrden(?Nodo $nodo) {
  global $result;
  if ($nodo === null) {
    return;
  }
  enOrden($nodo->izquierda);
  $result[] = $nodo->valor;
  enOrden($nodo->derecha);
}
