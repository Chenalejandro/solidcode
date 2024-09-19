function corteMasParejo(array) {
  const result = [];
  const array_size = array.length;
  function add(accumulator, value) {
    return accumulator + value;
  }
  for (let i = 0; i < array_size; i++) {
    const corteIzq = array.slice(0, i);
    const corteDer = array.slice(i);
    const sumaIzq = corteIzq.reduce(add, 0);
    const sumaDer = corteDer.reduce(add, 0);
    result.push(Math.abs(sumaIzq - sumaDer));
  }

  return Math.min(...result);
}
