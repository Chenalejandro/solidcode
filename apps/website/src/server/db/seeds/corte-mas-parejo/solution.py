def corteMasParejo(array):
    result = []
    arraySize = len(array)
    for i in range(0, arraySize):
        sumaIzq = sum(array[0:i])
        sumaDer = sum(array[i:arraySize])
        result.append(abs(sumaIzq - sumaDer))
    return min(result)
