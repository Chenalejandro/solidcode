#include <algorithm>
#include <vector>

using namespace std;

long resolver(vector<vector<long>> const &matriz, vector<vector<long>> &memo,
              int fila, int columna) {
  if (fila == 0 && columna == 0) {
    return matriz[0][0];
  }
  if (memo[fila][columna] == -1) {
    if (fila == 0) {
      memo[fila][columna] =
          resolver(matriz, memo, fila, columna - 1) + matriz[fila][columna];
    } else if (columna == 0) {
      memo[fila][columna] =
          resolver(matriz, memo, fila - 1, columna) + matriz[fila][columna];
    } else {
      memo[fila][columna] = max(
          resolver(matriz, memo, fila, columna - 1) + matriz[fila][columna],
          resolver(matriz, memo, fila - 1, columna) + matriz[fila][columna]);
    }
  }
  return memo[fila][columna];
};

long caminoDeMayorGanancia(vector<vector<long>> matriz) {
  auto filas = matriz.size();
  auto columnas = matriz[0].size();

  vector<vector<long>> memo(filas, vector<long>(columnas, -1));

  return resolver(matriz, memo, filas - 1, columnas - 1);
}
