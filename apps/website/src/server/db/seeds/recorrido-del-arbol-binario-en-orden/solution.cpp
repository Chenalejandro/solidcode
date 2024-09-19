#include <vector>
using namespace std;

struct Nodo {
  long valor;
  Nodo *izquierdo;
  Nodo *derecho;
  Nodo(long x) : valor(x), izquierdo(nullptr), derecho(nullptr) {}
  Nodo(long x, Nodo *izquierdo, Nodo *derecho)
      : valor(x), izquierdo(izquierdo), derecho(derecho) {}
};

vector<long> result;

void enOrden(Nodo *nodo) {
  if (nodo == nullptr) {
    return;
  }
  enOrden(nodo->izquierdo);
  result.push_back(nodo->valor);
  enOrden(nodo->derecho);
}

vector<long> recorridoDeArbolBinarioEnOrden(Nodo *raiz) {
  result.clear();
  enOrden(raiz);
  return result;
}
