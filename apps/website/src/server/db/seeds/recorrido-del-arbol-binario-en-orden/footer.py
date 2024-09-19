

# def convertArrayToTree(array):
#     if not array:
#         return None
#     root = Nodo(array[0])
#     queue = []
#     queue.append(root)
#     i = 1
#     while i < len(array):
#         currenNode = queue.pop(0)
#         if i < len(array):
#             value = array[i]
#             i += 1
#             currenNode.izquierdo = None if value == -1 else Nodo(value)
#             queue.append(currenNode.izquierdo)
#         if i < len(array):
#             value = array[i]
#             i += 1
#             currenNode.derecho = None if value == -1 else Nodo(value)
#             queue.append(currenNode.derecho)
#     return root


def convertArrayToTree(array: list[int]) -> Nodo | None:
    if len(array) == 0:
        return None

    root = Nodo(array[0])
    queue = []
    queue.append(root)

    i = 1
    while i < len(array):
        currentNode = queue.pop(0)

        left_value = array[i]
        i += 1
        if left_value != -1:
            currentNode.izquierdo = Nodo(left_value)
            queue.append(currentNode.izquierdo)

        if i < len(array):
            right_value = array[i]
            i += 1
            if right_value != -1:
                currentNode.derecho = Nodo(right_value)
                queue.append(currentNode.derecho)

    return root


if __name__ == "__main__":
    fptr = open(os.environ["OUTPUT_PATH"], "w")
    inputCount = int(input().strip())
    arrays = []

    for i in range(inputCount):
        ar_count = int(input().strip())
        arrays.append(list(map(int, input().rstrip().split())))

    for i in range(inputCount):
        result = recorridoDeArbolBinarioEnOrden(convertArrayToTree(arrays[i]))
        fptr.write(" ".join(map(str, result)))
        if i != inputCount - 1:
            fptr.write("\n")
    fptr.close()
