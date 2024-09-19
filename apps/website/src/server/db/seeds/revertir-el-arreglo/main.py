import math
import os
import random
import re
import sys

#
# Completar la función 'revertir' de acá abajo.
#
# Esta función retorna un arreglo de números.
#

def revertir(ar):
    result = []
    arraySize = len(ar)
    for i in range(arraySize - 1, -1, -1):
        result.append(ar[i])
    return result
