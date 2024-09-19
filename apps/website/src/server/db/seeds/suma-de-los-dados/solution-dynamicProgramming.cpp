#include <algorithm>
#include <vector>

using namespace std;

long sumaParcial(vector<vector<long>> &matrix, long cantCaras, long cantDados,
                 long sumaRequerida) {
  if (cantDados == 1) {
    if (sumaRequerida >= 1 && sumaRequerida <= cantCaras) {
      return 1;
    }
    return 0;
  }
  if (matrix[cantDados][sumaRequerida] == -1) {
    long suma = 0;
    const long minimo = min(cantCaras, sumaRequerida);
    for (long i = 1; i <= minimo; i++) {
      suma += sumaParcial(matrix, cantCaras, cantDados - 1, sumaRequerida - i);
    }
    matrix[cantDados][sumaRequerida] = suma;
  }
  return matrix[cantDados][sumaRequerida];
}

long sumaDeLosDados(long cantDados, long cantCaras, long sumaRequerida) {
  long rows = cantDados + 1;
  long columns = sumaRequerida + 1;
  vector<vector<long>> matrix(rows, vector<long>(columns, -1));
  return sumaParcial(matrix, cantCaras, cantDados, sumaRequerida);
}
