#include <algorithm>
#include <fstream>
#include <iostream>
#include <iterator>
#include <numeric>
#include <sstream>
#include <string>
#include <vector>

using namespace std;

long maximaDuracionActual;

void maximaDuracionDeCancionesEnCdDesde(vector<long> const &duraciones,
                                        long const &capacidad,
                                        long const sumaActual, uint const index,
                                        long sumaDelRestante) {
  if (index == duraciones.size()) {
    if (sumaActual > maximaDuracionActual) {
      maximaDuracionActual = sumaActual;
    }
    return;
  }

  // Poda por optimalidad
  if (sumaActual + sumaDelRestante <= maximaDuracionActual) {
    return;
  }

  long nuevaSumaDelRestante = sumaDelRestante - duraciones[index];
  // Poda por factibilidad
  if (sumaActual + duraciones[index] > capacidad) {
    maximaDuracionDeCancionesEnCdDesde(duraciones, capacidad, sumaActual,
                                       index + 1, nuevaSumaDelRestante);
    return;
  }

  maximaDuracionDeCancionesEnCdDesde(duraciones, capacidad,
                                     sumaActual + duraciones[index], index + 1,
                                     nuevaSumaDelRestante);
  maximaDuracionDeCancionesEnCdDesde(duraciones, capacidad, sumaActual,
                                     index + 1, nuevaSumaDelRestante);
}

long maximaDuracionDeCancionesEnCd(vector<long> duraciones, long capacidad) {
  maximaDuracionActual = 0;
  uint length = duraciones.size();
  long sumaDelRestante = accumulate(duraciones.begin(), duraciones.end(), 0);
  maximaDuracionDeCancionesEnCdDesde(duraciones, capacidad, 0, 0,
                                     sumaDelRestante);
  return maximaDuracionActual;
}
