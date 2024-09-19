"use strict";

const fs = require("fs");

class Nodo {
  constructor(valor, izquierdo, derecho) {
    this.valor = valor;
    this.izquierdo = izquierdo === undefined ? null : izquierdo;
    this.derecho = derecho === undefined ? null : derecho;
  }
}

/*
 * Completar la función 'invertirArbolBinario' de acá abajo.
 *
 * Esta función retorna un nodo (arbol)
 */

function invertirArbolBinario(nodo) {
  return nodo;
}
