function corteMasParejo(array) {
  const sumaTotal = array.reduce((acum, valor) => acum + valor, 0);
  let minimoActual = sumaTotal;
  let sumaAcumuladaIzquierda = 0;
  let sumaAcumuladaDerecha = sumaTotal;
  for (const elemento of array) {
    sumaAcumuladaIzquierda += elemento;
    sumaAcumuladaDerecha -= elemento;
    const diferencia = Math.abs(sumaAcumuladaIzquierda - sumaAcumuladaDerecha);
    if (diferencia < minimoActual) {
      minimoActual = diferencia;
    }
  }
  return minimoActual;
}
