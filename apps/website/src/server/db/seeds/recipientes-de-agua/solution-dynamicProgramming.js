function recipientesDeAgua(
  capacidadRecipientes,
  capacidadBalde1,
  capacidadBalde2,
) {
  const sumaAcumulada = new Array(capacidadRecipientes.length + 1);
  sumaAcumulada[0] = 0;
  for (let i = 1; i < sumaAcumulada.length; i++) {
    sumaAcumulada[i] = sumaAcumulada[i - 1] + capacidadRecipientes[i - 1];
  }

  const rows = capacidadRecipientes.length;
  const columns = capacidadBalde1 + 1;
  const matrix = Array.from({ length: rows }, () => new Array(columns));

  const capacidadTotal = capacidadBalde1 + capacidadBalde2;

  return aux(
    matrix,
    capacidadRecipientes,
    sumaAcumulada,
    capacidadTotal,
    0,
    capacidadBalde1,
  );
}

function aux(
  matrix,
  capacidadRecipientes,
  sumaAcumulada,
  capacidadTotal,
  indice,
  capacidadRemanenteBalde1,
) {
  const capacidadRemanenteTotal = capacidadTotal - sumaAcumulada[indice];
  const capacidadRemanenteBalde2 =
    capacidadRemanenteTotal - capacidadRemanenteBalde1;
  if (indice === capacidadRecipientes.length - 1) {
    if (
      capacidadRemanenteBalde1 >= capacidadRecipientes[indice] ||
      capacidadRemanenteBalde2 >= capacidadRecipientes[indice]
    ) {
      return indice + 1;
    }
    return indice;
  }
  if (matrix[indice][capacidadRemanenteBalde1] === undefined) {
    if (
      capacidadRemanenteBalde1 < capacidadRecipientes[indice] &&
      capacidadRemanenteBalde2 < capacidadRecipientes[indice]
    ) {
      matrix[indice][capacidadRemanenteBalde1] = indice;
    } else if (
      capacidadRemanenteBalde1 >= capacidadRecipientes[indice] &&
      capacidadRemanenteBalde2 >= capacidadRecipientes[indice]
    ) {
      matrix[indice][capacidadRemanenteBalde1] = Math.max(
        aux(
          matrix,
          capacidadRecipientes,
          sumaAcumulada,
          capacidadTotal,
          indice + 1,
          capacidadRemanenteBalde1 - capacidadRecipientes[indice],
        ),
        aux(
          matrix,
          capacidadRecipientes,
          sumaAcumulada,
          capacidadTotal,
          indice + 1,
          capacidadRemanenteBalde1,
        ),
      );
    } else if (capacidadRemanenteBalde1 >= capacidadRecipientes[indice]) {
      matrix[indice][capacidadRemanenteBalde1] = aux(
        matrix,
        capacidadRecipientes,
        sumaAcumulada,
        capacidadTotal,
        indice + 1,
        capacidadRemanenteBalde1 - capacidadRecipientes[indice],
      );
    } else {
      matrix[indice][capacidadRemanenteBalde1] = aux(
        matrix,
        capacidadRecipientes,
        sumaAcumulada,
        capacidadTotal,
        indice + 1,
        capacidadRemanenteBalde1,
      );
    }
  }
  return matrix[indice][capacidadRemanenteBalde1];
}
