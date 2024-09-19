#include <vector>

using namespace std;

long aux(vector<vector<long>> &memo, long cantEstudiantes, long cantGrupos) {
  if (cantEstudiantes == cantGrupos || cantGrupos == 1) {
    return 1;
  }
  if (memo[cantEstudiantes][cantGrupos] == -1) {
    memo[cantEstudiantes][cantGrupos] =
        cantGrupos * aux(memo, cantEstudiantes - 1, cantGrupos) +
        aux(memo, cantEstudiantes - 1, cantGrupos - 1);
  }
  return memo[cantEstudiantes][cantGrupos];
};

long dividirEstudiantesEnGrupos(long cantEstudiantes, long cantGrupos) {
  long rows = cantEstudiantes + 1;
  long columns = cantGrupos + 1;
  vector<vector<long>> memo(rows, vector<long>(columns, -1));

  return aux(memo, cantEstudiantes, cantGrupos);
}
