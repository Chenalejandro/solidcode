#include <vector>

using namespace std;

long aux(vector<vector<long>> &matrix, vector<long> &duraciones,
         long capacidadRestante, long indice) {
  if (indice == 0) {
    return 0;
  }
  long indiceReal = indice - 1;
  if (matrix[indice][capacidadRestante] == -1) {
    if (duraciones[indiceReal] > capacidadRestante) {
      matrix[indice][capacidadRestante] =
          aux(matrix, duraciones, capacidadRestante, indice - 1);
    } else {
      matrix[indice][capacidadRestante] =
          max(aux(matrix, duraciones,
                  capacidadRestante - duraciones[indiceReal], indice - 1) +
                  duraciones[indiceReal],
              aux(matrix, duraciones, capacidadRestante, indice - 1));
    }
  }
  return matrix[indice][capacidadRestante];
}

long maximaDuracionDeCancionesEnCd(vector<long> duraciones, long capacidad) {
  long rows = duraciones.size() + 1;
  long columns = capacidad + 1;
  vector<vector<long>> matrix(rows, vector<long>(columns, -1));
  return aux(matrix, duraciones, capacidad, duraciones.size());
}
