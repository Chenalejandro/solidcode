'use strict';

const fs = require('fs');

/*
 * Completar la función 'revertir' de acá abajo.
 *
 * Esta función retorna un arreglo de números.
 */

function revertir(ar) {
    const result = [];
    const array_size = ar.length;
    for (let i = 0; i < array_size; i++) {
        result.push(ar[array_size - 1 - i]);
    }
    return result;
}
