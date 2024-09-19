#
# Completar la función 'maximaDuracionDeCancionesEnCd' de acá abajo.
#
# Esta función retorna un arreglo de números.
#
def maximaDuracionDeCancionesEnCd(duraciones, capacidad):
    rows = len(duraciones) + 1
    columns = capacidad + 1
    matrix = [[None] * columns for _ in range(rows)]
    return aux(matrix, duraciones, capacidad, len(duraciones))


def aux(matrix, duraciones, capacidadRestante, indice):
    if indice == 0:
        return 0
    indiceReal = indice - 1
    if matrix[indice][capacidadRestante] is None:
        if duraciones[indiceReal] > capacidadRestante:
            matrix[indice][capacidadRestante] = aux(
                matrix, duraciones, capacidadRestante, indice - 1
            )
        else:
            matrix[indice][capacidadRestante] = max(
                aux(
                    matrix,
                    duraciones,
                    capacidadRestante - duraciones[indiceReal],
                    indice - 1,
                )
                + duraciones[indiceReal],
                aux(matrix, duraciones, capacidadRestante, indice - 1),
            )
    return matrix[indice][capacidadRestante]
