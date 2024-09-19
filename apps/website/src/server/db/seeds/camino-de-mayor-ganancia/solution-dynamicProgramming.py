def caminoDeMayorGanancia(matrix):
    filas = len(matrix)
    columnas = len(matrix[0])
    memo = [[None for i in range(columnas)] for j in range(filas)]
    return resolver(matrix, memo, filas - 1, columnas - 1)


def resolver(matrix, memo, fila, columna):
    if fila == 0 and columna == 0:
        return matrix[0][0]
    if memo[fila][columna] is None:
        if fila == 0:
            memo[fila][columna] = resolver(matrix, memo, fila, columna - 1) + matrix[fila][columna]
        elif columna == 0:
            memo[fila][columna] = resolver(matrix, memo, fila - 1, columna) + matrix[fila][columna]
        else:
            memo[fila][columna] = max(
                resolver(matrix, memo, fila, columna - 1) + matrix[fila][columna],
                resolver(matrix, memo, fila - 1, columna) + matrix[fila][columna]
            )
    return memo[fila][columna]
