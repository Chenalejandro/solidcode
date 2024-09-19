function dividirEstudiantesEnGrupos(cantEstudiantes, cantGrupos) {
  if (cantEstudiantes === cantGrupos || cantGrupos === 1) {
    return 1;
  }
  return (
    cantGrupos * dividirEstudiantesEnGrupos(cantEstudiantes - 1, cantGrupos) +
    dividirEstudiantesEnGrupos(cantEstudiantes - 1, cantGrupos - 1)
  );
}
