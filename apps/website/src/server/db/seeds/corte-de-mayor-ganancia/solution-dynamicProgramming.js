
function corteDeMayorGanancia(precios, longitud) {
  const memo = Array(longitud + 1);

  function aux(longitudActual) {
    if (longitudActual === 0) {
      return 0;
    }
    if (memo[longitudActual] === undefined) {
      memo[longitudActual] = 0;
      for (let i = 1; i <= longitudActual; i++) {
        const indiceReal = i - 1;
        memo[longitudActual] = Math.max(
          memo[longitudActual],
          precios[indiceReal] + aux(longitudActual - i),
        );
      }
    }

    return memo[longitudActual];
  }
  return aux(longitud);
}
