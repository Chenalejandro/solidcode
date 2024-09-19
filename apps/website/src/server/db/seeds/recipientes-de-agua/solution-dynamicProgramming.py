def recipientesDeAgua(capacidadRecipientes, capacidadBalde1, capacidadBalde2):
    sumaAcumulada = [0] * (len(capacidadRecipientes) + 1)
    for i in range(1, len(sumaAcumulada)):
        sumaAcumulada[i] = sumaAcumulada[i - 1] + capacidadRecipientes[i - 1]

    rows = len(capacidadRecipientes)
    columns = capacidadBalde1 + 1
    matrix = [[None] * columns for _ in range(rows)]

    capacidadTotal = capacidadBalde1 + capacidadBalde2

    return aux(
        matrix,
        capacidadRecipientes,
        sumaAcumulada,
        capacidadTotal,
        0,
        capacidadBalde1,
    )


def aux(
    matrix,
    capacidadRecipientes,
    sumaAcumulada,
    capacidadTotal,
    indice,
    capacidadRemanenteBalde1,
):
    capacidadRemanenteTotal = capacidadTotal - sumaAcumulada[indice]
    capacidadRemanenteBalde2 = capacidadRemanenteTotal - capacidadRemanenteBalde1
    if indice == len(capacidadRecipientes) - 1:
        if (
            capacidadRemanenteBalde1 >= capacidadRecipientes[indice]
            or capacidadRemanenteBalde2 >= capacidadRecipientes[indice]
        ):
            return indice + 1
        return indice

    if matrix[indice][capacidadRemanenteBalde1] is None:
        if (
            capacidadRemanenteBalde1 < capacidadRecipientes[indice]
            and capacidadRemanenteBalde2 < capacidadRecipientes[indice]
        ):
            matrix[indice][capacidadRemanenteBalde1] = indice
        elif (
            capacidadRemanenteBalde1 >= capacidadRecipientes[indice]
            and capacidadRemanenteBalde2 >= capacidadRecipientes[indice]
        ):
            matrix[indice][capacidadRemanenteBalde1] = max(
                aux(
                    matrix,
                    capacidadRecipientes,
                    sumaAcumulada,
                    capacidadTotal,
                    indice + 1,
                    capacidadRemanenteBalde1 - capacidadRecipientes[indice],
                ),
                aux(
                    matrix,
                    capacidadRecipientes,
                    sumaAcumulada,
                    capacidadTotal,
                    indice + 1,
                    capacidadRemanenteBalde1,
                ),
            )
        elif capacidadRemanenteBalde1 >= capacidadRecipientes[indice]:
            matrix[indice][capacidadRemanenteBalde1] = aux(
                matrix,
                capacidadRecipientes,
                sumaAcumulada,
                capacidadTotal,
                indice + 1,
                capacidadRemanenteBalde1 - capacidadRecipientes[indice],
            )
        else:
            matrix[indice][capacidadRemanenteBalde1] = aux(
                matrix,
                capacidadRecipientes,
                sumaAcumulada,
                capacidadTotal,
                indice + 1,
                capacidadRemanenteBalde1,
            )
    return matrix[indice][capacidadRemanenteBalde1]
