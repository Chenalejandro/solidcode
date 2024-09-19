function sumaDeLosDados(cantDados, cantCaras, sumaRequerida) {
  const rows = cantDados + 1;
  const columns = sumaRequerida + 1;
  const matrix = Array.from({ length: rows }, () => new Array(columns));

  return sumaParcial(matrix, cantCaras, cantDados, sumaRequerida);
}

function sumaParcial(matrix, cantCaras, cantidadDeDados, sumaRequerida) {
  if (cantidadDeDados === 1) {
    if (sumaRequerida >= 1 && sumaRequerida <= cantCaras) {
      return 1;
    }
    return 0;
  }
  if (matrix[cantidadDeDados][sumaRequerida] === undefined) {
    let suma = 0;
    const minimo = Math.min(cantCaras, sumaRequerida);
    for (let i = 1; i <= minimo; i++) {
      suma += sumaParcial(
        matrix,
        cantCaras,
        cantidadDeDados - 1,
        sumaRequerida - i,
      );
    }

    matrix[cantidadDeDados][sumaRequerida] = suma;
  }

  return matrix[cantidadDeDados][sumaRequerida];
}
