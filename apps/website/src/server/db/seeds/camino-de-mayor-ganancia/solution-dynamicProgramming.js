function caminoDeMayorGanacia(matrix) {
  const filas = matrix.length;
  const columnas = matrix[0].length;
  const memo = Array.from({ length: filas }, () => new Array(columnas));

  function resolver(fila, columna) {
    if (fila === 0 && columna === 0) {
      return matrix[0][0];
    }
    if (memo[fila][columna] === undefined) {
      if (fila === 0) {
        memo[fila][columna] =
          resolver(fila, columna - 1) + matrix[fila][columna];
      } else if (columna === 0) {
        memo[fila][columna] =
          resolver(fila - 1, columna) + matrix[fila][columna];
      } else {
        memo[fila][columna] = Math.max(
          resolver(fila, columna - 1) + matrix[fila][columna],
          resolver(fila - 1, columna) + matrix[fila][columna],
        );
      }
    }
    return memo[fila][columna];
  }

  return resolver(filas - 1, columnas - 1);
}
