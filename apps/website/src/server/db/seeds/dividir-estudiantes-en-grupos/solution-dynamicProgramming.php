<?php

function dividirEstudiantesEnGrupos(int $cantEstudiantes, int $cantGrupos): int {
  $rows = $cantEstudiantes + 1;
  $columns = $cantGrupos + 1;
  $memo = array_fill(0, $rows, array_fill(0, $columns, null));

  return aux($memo, $cantEstudiantes, $cantGrupos);
}

function aux(array &$memo, int $cantEstudiantes, int $cantGrupos): int {
  if ($cantEstudiantes === $cantGrupos || $cantGrupos === 1) {
    return 1;
  }
  if ($memo[$cantEstudiantes][$cantGrupos] === null) {
    $memo[$cantEstudiantes][$cantGrupos] =
      $cantGrupos * aux($memo, $cantEstudiantes - 1, $cantGrupos) +
      aux($memo, $cantEstudiantes - 1, $cantGrupos - 1);
  }
  return $memo[$cantEstudiantes][$cantGrupos];
}
