function sumaDeLosDados(cantDados, cantCaras, sumaRequerida) {
  function sumaParcial(cantidadDeDados, sumaRequerida) {
    if (cantidadDeDados === 1) {
      if (sumaRequerida >= 1 && sumaRequerida <= cantCaras) {
        return 1;
      }
      return 0;
    }
    let suma = 0;
    const min = Math.min(cantCaras, sumaRequerida);
    for (let i = 1; i <= min; i++) {
      suma += sumaParcial(cantidadDeDados - 1, sumaRequerida - i);
    }
    return suma;
  }

  return sumaParcial(cantDados, sumaRequerida);
}
