
if __name__ == "__main__":
    fptr = open(os.environ["OUTPUT_PATH"], "w")
    inputCount = int(input().strip())
    arrays = []

    for i in range(inputCount):
        capacidad = int(input().strip())
        ar_count = int(input().strip())
        arrays.append({"duraciones": list(map(int, input().rstrip().split())), "capacidad": capacidad})

    for i in range(inputCount):
        result = maximaDuracionDeCancionesEnCd(arrays[i]["duraciones"], arrays[i]["capacidad"])
        fptr.write(str(result))
        if i != inputCount - 1:
            fptr.write("\n")
    fptr.close()
