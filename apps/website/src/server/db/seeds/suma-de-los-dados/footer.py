
if __name__ == "__main__":
    fptr = open(os.environ["OUTPUT_PATH"], "w")
    inputCount = int(input().strip())
    arrays = []

    for i in range(inputCount):
        arrays.append(list(map(int, input().rstrip().split())))

    for i in range(inputCount):
        result = sumaDeLosDados(arrays[i][0], arrays[i][1], arrays[i][2])
        fptr.write(str(result))
        if i != inputCount - 1:
            fptr.write("\n")
    fptr.close()
