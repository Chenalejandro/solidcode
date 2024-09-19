def corteDeMayorGanancia(precios, longitud):
    memo = [None for i in range(longitud + 1)]
    return aux(precios, memo, longitud)


def aux(precios, memo, longitudActual):
    if longitudActual == 0:
        return 0
    if memo[longitudActual] is None:
        memo[longitudActual] = 0
        for i in range(1, longitudActual + 1):
            indiceReal = i - 1
            memo[longitudActual] = max(
                memo[longitudActual],
                precios[indiceReal] + aux(precios, memo, longitudActual - i),
            )
    return memo[longitudActual]
