Nodo *invertirArbolBinario(Nodo *raiz) {
  if (raiz == nullptr) {
    return nullptr;
  }
  Nodo *nodoTemp = raiz->izquierdo;
  raiz->izquierdo = raiz->derecho;
  raiz->derecho = nodoTemp;
  invertirArbolBinario(raiz->izquierdo);
  invertirArbolBinario(raiz->derecho);
  return raiz;
}
