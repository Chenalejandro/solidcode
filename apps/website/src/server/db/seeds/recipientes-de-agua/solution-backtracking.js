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
  function aux(indice, capacidadRemanenteBalde1) {
    const capacidadRemanenteTotal =
      capacidadBalde1 + capacidadBalde2 - sumaAcumulada[indice];
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
    if (
      capacidadRemanenteBalde1 < capacidadRecipientes[indice] &&
      capacidadRemanenteBalde2 < capacidadRecipientes[indice]
    ) {
      return indice;
    }
    if (
      capacidadRemanenteBalde1 >= capacidadRecipientes[indice] &&
      capacidadRemanenteBalde2 >= capacidadRecipientes[indice]
    ) {
      return Math.max(
        aux(
          indice + 1,
          capacidadRemanenteBalde1 - capacidadRecipientes[indice],
        ),
        aux(indice + 1, capacidadRemanenteBalde1),
      );
    }
    if (capacidadRemanenteBalde1 >= capacidadRecipientes[indice]) {
      return aux(
        indice + 1,
        capacidadRemanenteBalde1 - capacidadRecipientes[indice],
      );
    }
    return aux(indice + 1, capacidadRemanenteBalde1);
  }
  return aux(0, capacidadBalde1);
}
