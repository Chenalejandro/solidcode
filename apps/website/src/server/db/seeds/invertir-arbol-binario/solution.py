def invertirArbolBinario(raiz: Nodo | None) -> Nodo | None:
    if raiz is None:
        return None
    tempNode = raiz.izquierdo
    raiz.izquierdo = raiz.derecho
    raiz.derecho = tempNode
    invertirArbolBinario(raiz.derecho)
    invertirArbolBinario(raiz.izquierdo)
    return raiz
