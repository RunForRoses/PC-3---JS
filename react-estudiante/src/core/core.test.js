import { test } from 'node:test';
import assert from 'node:assert/strict';

import { esISBN, esCodigoAlumno, esFecha, validarPrestamo } from './validadores.js';
import { Libro, Prestamo } from './modelos.js';
import { prestamosPorEstado, librosMasPrestados, autoresUnicos, puedePrestar, crearGeneradorCodigos } from './estadisticas.js';

test('esISBN: exactamente 13 digitos y empieza con 978 o 979', () => {
    assert.equal(esISBN('9780132350884'), true);
    assert.equal(esISBN('9791090636071'), true);
    assert.equal(esISBN('9770132350884'), false);
    assert.equal(esISBN('978123456789'), false);
    assert.equal(esISBN('97812345678901'), false);
});

test('esCodigoAlumno: U mayuscula seguida de 8 digitos', () => {
    assert.equal(esCodigoAlumno('U23307645'), true);
    assert.equal(esCodigoAlumno('u23307645'), false);
    assert.equal(esCodigoAlumno('U1234567'), false);
    assert.equal(esCodigoAlumno('U123456789'), false);
});

test('esFecha: formato AAAA-MM-DD con mes 01-12 y dia 01-31', () => {
    assert.equal(esFecha('2026-11-20'), true);
    assert.equal(esFecha('20-11-2026'), false);
    assert.equal(esFecha('2026-13-01'), false);
    assert.equal(esFecha('2026-11-32'), false);
});

test('validarPrestamo: valida libroId, formato de fechas, devolucion posterior y maximo 15 dias', () => {
    const prestamoValido = {
        libroId: 1,
        fechaPrestamo: '2026-11-01',
        fechaDevolucion: '2026-11-10'
    };
    assert.deepEqual(validarPrestamo(prestamoValido), {});

    const sinLibro = {
        libroId: '',
        fechaPrestamo: '2026-11-01',
        fechaDevolucion: '2026-11-10'
    };
    assert.ok(validarPrestamo(sinLibro).libroId);

    const fechasInvalidas = {
        libroId: 1,
        fechaPrestamo: 'invalido',
        fechaDevolucion: 'invalido'
    };
    const errFechas = validarPrestamo(fechasInvalidas);
    assert.ok(errFechas.fechaPrestamo);
    assert.ok(errFechas.fechaDevolucion);

    const fechaNoPosterior = {
        libroId: 1,
        fechaPrestamo: '2026-11-10',
        fechaDevolucion: '2026-11-10'
    };
    assert.ok(validarPrestamo(fechaNoPosterior).fechaDevolucion);

    const masDe15Dias = {
        libroId: 1,
        fechaPrestamo: '2026-11-01',
        fechaDevolucion: '2026-11-18'
    };
    assert.ok(validarPrestamo(masDe15Dias).duracion);
});

test('Libro: constructor y getter etiqueta Titulo (año)', () => {
    const libro = new Libro({ titulo: 'Cien años de soledad', año: 1967 });
    assert.equal(libro.etiqueta, 'Cien años de soledad (1967)');
});

test('Prestamo: getter activo, diasPrestamo y estaVencido', () => {
    const prestamo = new Prestamo({
        id: 1,
        libroId: 10,
        usuarioId: 5,
        fechaPrestamo: '2026-11-01',
        fechaDevolucion: '2026-11-10',
        estado: 'activo'
    });

    assert.equal(prestamo.activo, true);
    assert.equal(prestamo.diasPrestamo(), 9);
    assert.equal(prestamo.estaVencido('2026-11-11'), true);
    assert.equal(prestamo.estaVencido('2026-11-10'), false);
    assert.equal(prestamo.estaVencido('2026-11-05'), false);

    const prestamoDevuelto = new Prestamo({
        id: 2,
        libroId: 10,
        usuarioId: 5,
        fechaPrestamo: '2026-11-01',
        fechaDevolucion: '2026-11-10',
        estado: 'devuelto'
    });
    assert.equal(prestamoDevuelto.activo, false);
    assert.equal(prestamoDevuelto.estaVencido('2026-11-15'), false);
});

test('prestamosPorEstado: conteo por estado con reduce -> { activo, devuelto }', () => {
    const prestamos = [
        { estado: 'activo' },
        { estado: 'devuelto' },
        { estado: 'activo' }
    ];
    assert.deepEqual(prestamosPorEstado(prestamos), { activo: 2, devuelto: 1 });
});

test('librosMasPrestados: ranking con Map, sort y spread sin modificar el original', () => {
    const libros = [{ id: 1, titulo: 'A' }, { id: 2, titulo: 'B' }];
    const prestamos = [{ libroId: 2 }, { libroId: 2 }, { libroId: 1 }];
    const ranking = librosMasPrestados(libros, prestamos);

    assert.equal(ranking[0].id, 2);
    assert.equal(ranking[0].totalPrestamos, 2);
    assert.equal(ranking[1].id, 1);
    assert.equal(ranking[1].totalPrestamos, 1);
    assert.equal(libros[0].id, 1);
});

test('autoresUnicos: devuelve autores sin duplicados usando Set', () => {
    const libros = [
        { autor: 'Gabriel García Márquez' },
        { autor: 'Robert C. Martin' },
        { autor: 'Gabriel García Márquez' }
    ];
    assert.deepEqual(autoresUnicos(libros), ['Gabriel García Márquez', 'Robert C. Martin']);
});

test('puedePrestar: true si tiene menos de 3 prestamos activos', () => {
    const prestamos = [
        { usuarioId: 1, estado: 'activo' },
        { usuarioId: 1, estado: 'activo' }
    ];
    assert.equal(puedePrestar(1, prestamos), true);

    prestamos.push({ usuarioId: 1, estado: 'activo' });
    assert.equal(puedePrestar(1, prestamos), false);
});

test('crearGeneradorCodigos: closure que devuelve PRE-0008, PRE-0009... usando padStart', () => {
    const generar = crearGeneradorCodigos('PRE', 8);
    assert.equal(generar(), 'PRE-0008');
    assert.equal(generar(), 'PRE-0009');
});
