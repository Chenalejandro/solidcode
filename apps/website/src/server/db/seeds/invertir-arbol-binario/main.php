<?php

class Nodo {
  public $valor = null;
  public $izquierda = null;
  public $derecha = null;
  function __construct($valor, $izquierda = null, $derecha = null) {
    $this->valor = $valor;
    $this->izquierda = $izquierda;
    $this->derecha = $derecha;
  }
}

/*
 * Completar la función 'invertirArbolBinario' de acá abajo.
 *
 * Esta función retorna un nodo (arbol)
 */

function invertirArbolBinario(Nodo | null $raiz): Nodo | null {
  return $raiz;
}
