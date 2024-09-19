<?php

function invertirArbolBinario(Nodo | null $raiz): Nodo | null {
  if ($raiz === null) {
    return null;
  }
  $tempNode = $raiz->izquierda;
  $raiz->izquierda = $raiz->derecha;
  $raiz->derecha = $tempNode;
  invertirArbolBinario($raiz->derecha);
  invertirArbolBinario($raiz->izquierda);
  return $raiz;
}
