def sumaDeLosDados(cantDados, cantCaras, sumaRequerida):
    rows = cantDados + 1
    columns = sumaRequerida + 1
    matrix = [[None for _ in range(columns)] for _ in range(rows)]
    return sumaParcial(matrix, cantCaras, cantDados, sumaRequerida)


def sumaParcial(matrix, cantCaras, cantDados, sumaRequerida):
    if cantDados == 1:
        if sumaRequerida >= 1 and sumaRequerida <= cantCaras:
            return 1
        return 0
    if matrix[cantDados][sumaRequerida] is None:
        suma = 0
        minimo = min(cantCaras, sumaRequerida)
        for i in range(1, minimo + 1):
            suma += sumaParcial(matrix, cantCaras, cantDados - 1, sumaRequerida - i)
        matrix[cantDados][sumaRequerida] = suma
    return matrix[cantDados][sumaRequerida]
