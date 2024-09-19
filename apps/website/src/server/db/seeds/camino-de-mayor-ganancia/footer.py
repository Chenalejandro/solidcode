
if __name__ == "__main__":
    fptr = open(os.environ["OUTPUT_PATH"], "w")
    inputCount = int(input().strip())
    arrays = []

    for i in range(inputCount):
        filas = int(input().strip())
        columnas = int(input().strip())
        matrix = []
        for j in range(filas):
            matrix.append(list(map(int, input().rstrip().split())))
        arrays.append(matrix)

    for i in range(inputCount):
        result = caminoDeMayorGanancia(arrays[i])
        fptr.write(str(result))
        if i != inputCount - 1:
            fptr.write("\n")
    fptr.close()
