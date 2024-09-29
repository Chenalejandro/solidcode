#include <vector>

using namespace std;

long aux(vector<vector<long>> &matrix, vector<long> &duraciones,
         long capacidadRestante, long indice) {
  if (indice == duraciones.size()) {
    return 0;
  }
  if (matrix[indice][capacidadRestante] == -1) {
    if (duraciones[indice] > capacidadRestante) {
      matrix[indice][capacidadRestante] = aux(matrix, duraciones, capacidadRestante, indice + 1);
    } else {
      matrix[indice][capacidadRestante] = max(
          aux(matrix, duraciones, capacidadRestante - duraciones[indice], indice + 1) + duraciones[indice],
          aux(matrix, duraciones, capacidadRestante, indice + 1)
      );
    }
  }
  return matrix[indice][capacidadRestante];
}

long maximaDuracionDeCancionesEnCd(vector<long> duraciones, long capacidad) {
  long rows = duraciones.size();
  long columns = capacidad + 1;
  vector<vector<long>> matrix(rows, vector<long>(columns, -1));
  return aux(matrix, duraciones, capacidad, 0);
}
