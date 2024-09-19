#include <vector>

using namespace std;

long aux(
    vector<vector<long>> &matrix,
    vector<long> &capacidadRecipientes,
    vector<long> &sumaAcumulada,
    long capacidadTotal,
    long indice,
    long capacidadRemanenteBalde1
) {
  long capacidadRemanenteTotal = capacidadTotal - sumaAcumulada[indice];
  long capacidadRemanenteBalde2 = capacidadRemanenteTotal - capacidadRemanenteBalde1;
  if (indice == capacidadRecipientes.size() - 1) {
    if (capacidadRemanenteBalde1 >= capacidadRecipientes[indice] || capacidadRemanenteBalde2 >= capacidadRecipientes[indice]) {
      return indice + 1;
    }
    return indice;
  }

  if (matrix[indice][capacidadRemanenteBalde1] == -1) {
    if (capacidadRemanenteBalde1 < capacidadRecipientes[indice] && capacidadRemanenteBalde2 < capacidadRecipientes[indice]) {
      matrix[indice][capacidadRemanenteBalde1] = indice;
    } else if (capacidadRemanenteBalde1 >= capacidadRecipientes[indice] && capacidadRemanenteBalde2 >= capacidadRecipientes[indice]) {
      matrix[indice][capacidadRemanenteBalde1] = max(
          aux(matrix,
              capacidadRecipientes,
              sumaAcumulada,
              capacidadTotal,
              indice + 1,
              capacidadRemanenteBalde1 - capacidadRecipientes[indice]
          ),
          aux(matrix,
              capacidadRecipientes,
              sumaAcumulada,
              capacidadTotal,
              indice + 1,
              capacidadRemanenteBalde1
          )
      );
    } else if (capacidadRemanenteBalde1 >= capacidadRecipientes[indice]) {
      matrix[indice][capacidadRemanenteBalde1] = aux(
          matrix,
          capacidadRecipientes,
          sumaAcumulada,
          capacidadTotal,
          indice + 1,
          capacidadRemanenteBalde1 - capacidadRecipientes[indice]
      );
    } else {
      matrix[indice][capacidadRemanenteBalde1] = aux(
          matrix,
          capacidadRecipientes,
          sumaAcumulada,
          capacidadTotal,
          indice + 1,
          capacidadRemanenteBalde1
      );
    }
  }
  return matrix[indice][capacidadRemanenteBalde1];
}

long recipienteDeAgua(vector<long> capacidadRecipientes, long capacidadBalde1, long capacidadBalde2) {
  vector<long> sumaAcumulada(capacidadRecipientes.size() + 1, 0);
  for (int i = 1; i < capacidadRecipientes.size(); i++) {
    sumaAcumulada[i] = sumaAcumulada[i - 1] + capacidadRecipientes[i - 1];
  }

  long rows = capacidadRecipientes.size();
  long columns = capacidadBalde1 + 1;
  vector<vector<long>> matrix(rows, vector<long>(columns, -1));

  long capacidadTotal = capacidadBalde1 + capacidadBalde2;

  return aux(matrix, capacidadRecipientes, sumaAcumulada, capacidadTotal, 0, capacidadBalde1);
}
