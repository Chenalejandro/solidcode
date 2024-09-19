#include <vector>

using namespace std;

long aux(vector<long> const &precios, vector<long> &memo, int longitudActual) {
  if (longitudActual == 0) {
    return 0;
  }
  if (memo[longitudActual] == -1) {
    memo[longitudActual] = 0;
    for (int i = 1; i <= longitudActual; i++) {
      long indiceReal = i - 1;
      memo[longitudActual] =
          max(memo[longitudActual],
              precios[indiceReal] + aux(precios, memo, longitudActual - i));
    }
  }
  return memo[longitudActual];
};

long corteDeMayorGanancia(vector<long> precios, int longitud) {
  vector<long> memo(longitud + 1, -1);
  return aux(precios, memo, longitud);
}
