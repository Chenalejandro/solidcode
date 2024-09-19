
if __name__ == "__main__":
    fptr = open(os.environ["OUTPUT_PATH"], "w")
    inputCount = int(input().strip())
    arrays = []

    for i in range(inputCount):
        longitud = int(input().strip())
        ar_count = int(input().strip())
        arrays.append(
            {
                "precios": list(map(int, input().rstrip().split())),
                "longitud": longitud,
            }
        )

    for i in range(inputCount):
        result = corteDeMayorGanancia(arrays[i]["precios"], arrays[i]["longitud"])
        fptr.write(str(result))
        if i != inputCount - 1:
            fptr.write("\n")
    fptr.close()
