#
# Completar la función 'maximaDuracionDeCancionesEnCd' de acá abajo.
#
# Esta función retorna un arreglo de números.
#
def maximaDuracionDeCancionesEnCd(duraciones, capacidad):
    rows = len(duraciones)
    columns = capacidad + 1
    matrix = [[None] * columns for _ in range(rows)]
    return aux(matrix, duraciones, capacidad, 0)


def aux(matrix, duraciones, capacidadRestante, indice):
    if indice == len(duraciones):
        return 0
    if matrix[indice][capacidadRestante] is None:
        if duraciones[indice] > capacidadRestante:
            matrix[indice][capacidadRestante] = aux(matrix, duraciones, capacidadRestante, indice + 1)
        else:
            matrix[indice][capacidadRestante] = max(
                aux(matrix, duraciones, capacidadRestante - duraciones[indice], indice + 1) + duraciones[indice],
                aux(matrix, duraciones, capacidadRestante, indice + 1)
            )
    return matrix[indice][capacidadRestante]
