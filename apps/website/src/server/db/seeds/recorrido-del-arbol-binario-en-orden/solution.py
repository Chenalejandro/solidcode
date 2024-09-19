class Nodo:
    def __init__(self, valor, izquierdo=None, derecho=None):
        self.valor = valor
        self.izquierdo = izquierdo
        self.derecho = derecho


result = []


def recorridoDeArbolBinarioEnOrden(raiz: Nodo | None) -> list[int]:
    result.clear()
    enOrden(raiz)
    return result


def enOrden(nodo: Nodo | None):
    if nodo is None:
        return
    enOrden(nodo.izquierdo)
    result.append(nodo.valor)
    enOrden(nodo.derecho)
