
if __name__ == '__main__':
    fptr = open(os.environ['OUTPUT_PATH'], 'w')
    inputCount = int(input().strip())
    arrays = []

    for i in range(inputCount):
        ar_count = int(input().strip())
        arrays.append(list(map(int, input().rstrip().split())))

    for i in range(inputCount):
        result = revertir(arrays[i])
        fptr.write(" ".join(map(str, result)))
        if i != inputCount - 1:
            fptr.write("\n")
    fptr.close()
