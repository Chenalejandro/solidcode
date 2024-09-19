/*
 * Completar la función 'maximaDuracionDeCancionesEnCd' de acá abajo.
 *
 * Esta función retorna un arreglo de números.
 */

function maximaDuracionDeCancionesEnCd(duraciones, capacidad) {
  const rows = duraciones.length + 1;
  const columns = capacidad + 1;
  const matrix = Array.from({ length: rows }, () => new Array(columns));
  return aux(matrix, duraciones, capacidad, duraciones.length);
}

function aux(matrix, duraciones, capacidadRestante, indice) {
  if (indice === 0) {
    return 0;
  }

  const indiceReal = indice - 1;
  if (matrix[indice][capacidadRestante] === undefined) {
    if (duraciones[indiceReal] > capacidadRestante) {
      matrix[indice][capacidadRestante] = aux(
        matrix,
        duraciones,
        capacidadRestante,
        indice - 1,
      );
    } else {
      matrix[indice][capacidadRestante] = Math.max(
        aux(
          matrix,
          duraciones,
          capacidadRestante - duraciones[indiceReal],
          indice - 1,
        ) + duraciones[indiceReal],
        aux(matrix, duraciones, capacidadRestante, indice - 1),
      );
    }
  }
  return matrix[indice][capacidadRestante];
}
