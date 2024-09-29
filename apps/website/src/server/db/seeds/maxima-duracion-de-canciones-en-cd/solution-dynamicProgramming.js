/*
 * Completar la función 'maximaDuracionDeCancionesEnCd' de acá abajo.
 *
 * Esta función retorna un arreglo de números.
 */

function maximaDuracionDeCancionesEnCd(duraciones, capacidad) {
  const rows = duraciones.length;
  const columns = capacidad + 1;
  const matrix = Array.from({ length: rows }, () => new Array(columns));
  return aux(matrix, duraciones, capacidad, duraciones.length - 1);
}

function aux(matrix, duraciones, capacidadRestante, indice) {
  if (indice === -1) {
    return 0;
  }

  if (matrix[indice][capacidadRestante] === undefined) {
    if (duraciones[indice] > capacidadRestante) {
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
          capacidadRestante - duraciones[indice],
          indice - 1,
        ) + duraciones[indice],
        aux(matrix, duraciones, capacidadRestante, indice - 1),
      );
    }
  }
  return matrix[indice][capacidadRestante];
}
