function recorridoDeArbolBinarioEnOrden(raiz) {
  const result = [];
  function enOrden(nodo) {
    if (nodo === null) {
      return;
    }
    enOrden(nodo.izquierdo);
    result.push(nodo.valor);
    enOrden(nodo.derecho);
  }
  enOrden(raiz);
  return result;
}
