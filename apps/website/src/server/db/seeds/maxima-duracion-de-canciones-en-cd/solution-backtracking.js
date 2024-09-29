function maximaDuracionDeCancionesEnCd(duraciones, capacidad) {

  function aux(capacidad, indice) {
    if (indice === duraciones.length) {
      return 0;
    }
    if (duraciones[indice] > capacidad) {
      return aux(capacidad, indice + 1);
    }
    return Math.max(aux(capacidad - duraciones[indice], indice + 1) + duraciones[indice], aux(capacidad, indice + 1));
  }

  return aux(capacidad, 0);
}
