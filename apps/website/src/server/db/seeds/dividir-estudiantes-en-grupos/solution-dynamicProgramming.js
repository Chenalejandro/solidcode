function aux(memo, cantEstudiantes, cantGrupos) {
  if (cantEstudiantes === cantGrupos || cantGrupos === 1n) {
    return 1n;
  }
  if (memo[cantEstudiantes][cantGrupos] === undefined) {
    memo[cantEstudiantes][cantGrupos] =
      cantGrupos * aux(memo,cantEstudiantes - 1n, cantGrupos) +
      aux(memo,cantEstudiantes - 1n, cantGrupos - 1n);
  }
  return memo[cantEstudiantes][cantGrupos];
}

function dividirEstudiantesEnGrupos(cantEstudiantes, cantGrupos) {
  const rows = cantEstudiantes + 1;
  const columns = cantGrupos + 1;
  const memo = Array.from({ length: rows }, () => new Array(columns));

  return aux(memo, BigInt(cantEstudiantes), BigInt(cantGrupos));
}
