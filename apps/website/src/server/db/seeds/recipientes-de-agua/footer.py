

if __name__ == "__main__":
    fptr = open(os.environ["OUTPUT_PATH"], "w")
    inputCount = int(input().strip())
    arrays = []

    for i in range(inputCount):
        arrays.append(
            {
                "capacidadRecipientes": list(map(int, input().rstrip().split())),
                "capacidadBaldes": list(map(int, input().rstrip().split()))
            }
        )

    for i in range(inputCount):
        result = recipientesDeAgua(arrays[i]["capacidadRecipientes"], arrays[i]["capacidadBaldes"][0], arrays[i]["capacidadBaldes"][1])
        fptr.write(str(result))
        if i != inputCount - 1:
            fptr.write("\n")
    fptr.close()
