function invertirArbolBinario(nodo) {
  if (nodo === null) {
    return null;
  }
  const tempNode = nodo.izquierdo;
  nodo.izquierdo = nodo.derecho;
  nodo.derecho = tempNode;
  invertirArbolBinario(nodo.izquierdo);
  invertirArbolBinario(nodo.derecho);
  return nodo;
}
