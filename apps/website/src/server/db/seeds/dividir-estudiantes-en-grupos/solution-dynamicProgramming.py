#
# Completar la función 'dividirEstudiantesEnGrupos' de acá abajo.
#
# Esta función retorna un número entero.
#
def aux(memo, cantEstudiantes, cantGrupos):
    if cantEstudiantes == cantGrupos or cantGrupos == 1:
        return 1
    if memo[cantEstudiantes][cantGrupos] is None:
        memo[cantEstudiantes][cantGrupos] = cantGrupos * aux(memo, cantEstudiantes - 1, cantGrupos) + aux(memo, cantEstudiantes - 1, cantGrupos - 1)
    return memo[cantEstudiantes][cantGrupos]

def dividirEstudiantesEnGrupos(cantEstudiantes, cantGrupos):
    rows = cantEstudiantes + 1
    columns = cantGrupos + 1
    memo = [[None] * columns for _ in range(rows)]
    return aux(memo, cantEstudiantes, cantGrupos)
