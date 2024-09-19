function caminoDeMayorGanacia(matrix) {
  const filas = matrix.length;
  const columnas = matrix[0].length;

  function resolver(fila, columna) {
    if (fila === 0 && columna === 0) {
      return matrix[0][0];
    }
    if (fila === 0) {
      return resolver(fila, columna - 1) + matrix[fila][columna];
    }
    if (columna === 0) {
      return resolver(fila - 1, columna) + matrix[fila][columna];
    }
    return Math.max(
      resolver(fila, columna - 1) + matrix[fila][columna],
      resolver(fila - 1, columna) + matrix[fila][columna],
    );
  }

  return resolver(filas - 1, columnas - 1);
}
