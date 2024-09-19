#include <algorithm>
#include <fstream>
#include <iostream>
#include <iterator>
#include <numeric>
#include <queue>
#include <sstream>
#include <stack>
#include <string>
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

vector<long> recorridoDeArbolBinarioEnOrden(Nodo *raiz) {
  // Escribir el código acá
  return {};
}
