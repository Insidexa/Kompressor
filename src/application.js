/**
 *
 * @type {{countStypen: number, gaz: number, diabat: number, gazEnter: number, temperateGazEnter: number, diametrWorkKolesa: number, angularSpeedRotor: number, koefFirstStypeNominal: number, stypensData: Array, Foi: Array, U2: number, Yri: Array, Nni: Array, Vn: Array}}
 */
let state = {
    countStypen: 1,

    // Газовая постоянная
    gaz: 0,

    // Показатель адиабаты
    diabat: 0,

    // Давление газа на входе
    gazEnter: 0,

    // Температура газа на входе
    temperateGazEnter: 0,


    // Диаметр рабочего колеса
    diametrWorkKolesa: 0,

    // Угловая скорость вращения ротора
    angularSpeedRotor: 0,

    // Усл. коеф. расхода 1-й ступени на ном. режиме
    koefFirstStypeNominal: 0,

    // ступени
    stypensData: [],

    Foi: [],

    U2: 0,

    Yri: [],

    Nni: [],

    Vn: []
};

/**
 * Генерация таблицы с вводом данных о ступени
 *
 * @param count
 */
function generateTable(count) {
    let html = '';

    for (let i = 0; i < count; i++) {
        html += `<h3>${i + 1} ступень</h3>
    <table class="table table-bordered">
                            <thead>
                            <tr>
                                <th>Наименование параметра</th>
                                <th>Обозначение</th>
                                <th>1-ый режим</th>
                                <th>2-ый режим</th>
                                <th>3-ый режим</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Коэффициент расхода</td>
                                <td>Ф<sub>0</sub> </td>
                                <td>
                                    <input type="number" step="0.001" class="data-koef-rasxod-styp${i}" value="0.05">
                                </td>
                                <td>
                                    <input type="number" step="0.001" class="data-koef-rasxod-styp${i}" value="0.07">
                                </td>
                                <td>
                                    <input type="number" step="0.001" class="data-koef-rasxod-styp${i}" value="0.095">
                                </td>
                            </tr>

                            <tr>
                                <td>Политропный КПД</td>
                                <td>&eta;<sub>0</sub> </td>
                                <td>
                                    <input type="number" step="0.001" class="data-polytron-kpd-kolesa-styp${i}" value="0.78">
                                </td>
                                <td>
                                    <input type="number" step="0.001" class="data-polytron-kpd-kolesa-styp${i}" value="0.81">
                                </td>
                                <td>
                                    <input type="number" step="0.001" class="data-polytron-kpd-kolesa-styp${i}" value="0.65">
                                </td>
                            </tr>

                            <tr>
                                <td>Коэф. политропного напора</td>
                                <td>&Psi;<sub>0</sub> </td>
                                <td>
                                    <input type="number" step="0.001" class="data-koef-polytron-napora-styp${i}" value="0.56">
                                </td>
                                <td>
                                    <input type="number" step="0.001" class="data-koef-polytron-napora-styp${i}" value="0.55">
                                </td>
                                <td>
                                    <input type="number" step="0.001" class="data-koef-polytron-napora-styp${i}" value="0.45">
                                </td>
                            </tr>

                            </tbody>
                        </table>`;
    }

    $('.stypens').html(html);

}

/**
 * генерация значений коэффициентов
 *
 * @param data
 */
function generateTableKoefStep2(data) {
    let html = '';

    for (let i = 0; i < data.length; i++) {

        html += `<div class="row">
<h5 class="text-center">Значение коэффициентов для ${i + 1} ступени</h5>
                            <div class="col-md-6">
                                <p>Для уравнения &eta; = f(Ф<sub>0</sub>)</p>
                                <table class="table table-bordered">
                                    <tr>
                                        <td>a</td>
                                        <td>${data[i].koefsRashoda.a.toFixed(3)}</td>
                                    </tr>
                                    <tr>
                                        <td>b</td>
                                        <td>${data[i].koefsRashoda.b.toFixed(3)}</td>
                                    </tr>
                                    <tr>
                                        <td>c</td>
                                        <td>${data[i].koefsRashoda.c.toFixed(3)}</td>
                                    </tr>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <p>Для уравнения &Psi; = f(Ф<sub>0</sub>)</p>
                                <table class="table table-bordered">
                                    <tr>
                                        <td>a</td>
                                        <td>${data[i].koefsPolytropNapora.a.toFixed(3)}</td>
                                    </tr>
                                    <tr>
                                        <td>b</td>
                                        <td>${data[i].koefsPolytropNapora.b.toFixed(3)}</td>
                                    </tr>
                                    <tr>
                                        <td>c</td>
                                        <td>${data[i].koefsPolytropNapora.c.toFixed(3)}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>`;

    }

    $('.result-koefs').html(html);

}

/**
 * Расчет детерминантов
 *
 * Расчет A1, B1, C1 для расчета Dk
 *
 * @param matrix
 * @param matrixCompare
 * @return {{a: number, b: number, c: number}}
 */
function calculateMatrix(matrix, matrixCompare) {
    /*let det = matrix[0][0] * matrix[1][1] * matrix[2][2]
     + matrix[1][0] * matrix[2][1] * matrix[0][2]
     + matrix[0][1] * matrix[1][2] * matrix[2][0]
     - matrix[0][2] * matrix[1][1] * matrix[2][0]
     - matrix[1][0] * matrix[0][1] * matrix[2][2]
     - matrix[0][0] * matrix[2][1] * matrix[1][2];*/

    let det = math.det(matrix);

    let det1 = matrixCompare[0] * matrix[1][1] * matrix[2][2]
        + matrixCompare[1] * matrix[2][1] * matrix[0][2]
        + matrix[0][1] * matrix[1][2] * matrixCompare[2]
        - matrix[0][2] * matrix[1][1] * matrixCompare[2]
        - matrixCompare[1] * matrix[0][1] * matrix[2][2]
        - matrixCompare[0] * matrix[2][1] * matrix[1][2];

    let det2 = matrix[0][0] * matrixCompare[1] * matrix[2][2]
        + matrix[1][0] * matrixCompare[2] * matrix[0][2]
        + matrixCompare[0] * matrix[1][2] * matrix[2][0]
        - matrix[0][2] * matrixCompare[1] * matrix[2][0]
        - matrix[1][0] * matrixCompare[0] * matrix[2][2]
        - matrix[0][0] * matrixCompare[2] * matrix[1][2];

    let det3 = matrix[0][0] * matrix[1][1] * matrixCompare[2]
        + matrix[1][0] * matrix[2][1] * matrixCompare[0]
        + matrix[0][1] * matrixCompare[1] * matrix[2][0]
        - matrixCompare[0] * matrix[1][1] * matrix[2][0]
        - matrix[1][0] * matrix[0][1] * matrixCompare[2]
        - matrix[0][0] * matrix[2][1] * matrixCompare[1];

    return {
        a: math.eval(`${det1} / ${det}`),
        b: math.eval(`${det2} / ${det}`),
        c: math.eval(`${det3} / ${det}`),
    };
}

/**
 * Создание базовой матрицы Dk
 *
 * @param Fi0
 * @param matrixCompare
 * @return {{matrix: *, result: {a: number, b: number, c: number}}}
 */
function createDMatrixKramer(Fi0, matrixCompare) {

    let Fi0Square = [
        Math.pow(Fi0[0], 2),
        Math.pow(Fi0[1], 2),
        Math.pow(Fi0[2], 2),
    ];

    let matrix = [[], [], []];

    matrix[0][0] = 1;
    matrix[1][0] = 1;
    matrix[2][0] = 1;

    matrix[0][1] = Fi0[0];
    matrix[1][1] = Fi0[1];
    matrix[2][1] = Fi0[2];

    matrix[0][2] = Fi0Square[0];
    matrix[1][2] = Fi0Square[1];
    matrix[2][2] = Fi0Square[2];

    // базовая матрица для всего
    return {
        matrix: math.matrix(matrix),
        result: calculateMatrix(matrix, matrixCompare)
    };

}

/**
 * Генерация ступеней с входный данных
 *
 * @return {Array}
 */
function getStypensData() {

    let stypens = [];

    for (let i = 0; i < state.countStypen; i++) {

        let stypen = {koefRashoda: [], polytronKdp: [], koefNapora: []};

        $(`.data-koef-rasxod-styp${i}`).each(function (index, item) {
            stypen.koefRashoda.push(parseFloat($(item).val()));
        });

        $(`.data-polytron-kpd-kolesa-styp${i}`).each(function (index, item) {
            stypen.polytronKdp.push(parseFloat($(item).val()));
        });

        $(`.data-koef-polytron-napora-styp${i}`).each(function (index, item) {
            stypen.koefNapora.push(parseFloat($(item).val()));
        });

        stypens.push(stypen);

    }

    return stypens;

}

/**
 * Инициализация входных данных & построение структуры ступеней
 */
function initData() {
    state.gaz = parseFloat($('.data-gaz').val());
    state.diabat = parseFloat($('.data-diabat').val());
    state.gazEnter = parseFloat($('.data-gaz-enter').val());
    state.temperateGazEnter = parseFloat($('.data-temperature-gaz-enter').val());

    state.diametrWorkKolesa = parseFloat($('.data-diametr-work-kolesa').val());
    state.angularSpeedRotor = parseFloat($('.data-angular-speed-rotor').val());
    state.koefFirstStypeNominal = parseFloat($('.data-koef_first_stype_nominal').val());

    state.stypensData = getStypensData();
}

/**
 * Определение коэффициентов уравнений
 */
function step2() {
    for (let i = 0; i < state.stypensData.length; i++) {

        // коэф. расхода Ф0
        let aF = createDMatrixKramer(state.stypensData[i].koefRashoda, state.stypensData[i].polytronKdp);

        // коэф. политропного напора Ψ0
        let aY = createDMatrixKramer(state.stypensData[i].koefRashoda, state.stypensData[i].koefNapora);

        state.stypensData[i].koefsRashoda = aF.result;
        state.stypensData[i].koefsPolytropNapora = aY.result;
    }

    generateTableKoefStep2(state.stypensData);
}

/**
 * Расчет  производительности  комрессора на входе
 */
function step3() {
    let U2 = math.eval(`(${state.angularSpeedRotor} * ${state.diametrWorkKolesa}) / 2`);

    state.U2 = U2;

    let html = `<table class="table table-bordered">
<tr>
    <td>№ режима</td>
    <td>Объем. производ.</td>
</tr>`;

    for (let i = 0; i < 5; i++) {
        let a = math.eval('0.25 * ' + (i + 1) + ' + 0.25');
        let F0i = math.eval(a + ' * ' + state.koefFirstStypeNominal);

        state.Foi.push(F0i);

        let Vn = ( math.PI * math.pow(state.diametrWorkKolesa, 2) * U2 * F0i ) / 4;

        state.Vn.push(Vn.toFixed(2));

        html += `<tr>
                    <td>${i + 1}</td>
                    <td>${Vn.toFixed(2)}</td>
                </tr>`;
    }

    html += '</table>';

    $('.result-koef-rashoda').html(html);

}

/**
 * Расчет отношений давлений первой ступени
 */
function step4() {

    let html = '';

    for (let k = 0; k < state.stypensData.length; k++) {

        html += `<table class="table table-bordered">
                <tr>
                    <td>№ режима</td>
                    <td>П</td>
                    <td>&Psi;<sub>ni</sub></td>
                    <td>&eta;<sub>ni</sub></td>
                    <td>&oacute;<sub>i</sub></td>
                    <td>E</td>
                </tr>`;

        state.stypensData[k].dataP = [];
        state.stypensData[k].dataY = [];
        state.stypensData[k].dataN = [];

        for (let i = 0; i < 5; i++) {

            let Yri = state.stypensData[k].koefsPolytropNapora.a
                + state.stypensData[k].koefsPolytropNapora.b
                * state.Foi[i]
                + state.stypensData[k].koefsPolytropNapora.c
                * math.pow(state.Foi[i], 2);

            let Nni = state.stypensData[k].koefsRashoda.a
                + state.stypensData[k].koefsRashoda.b
                * state.Foi[i]
                + state.stypensData[k].koefsRashoda.c
                * math.pow(state.Foi[i], 2);

            let O = ( state.diabat / (state.diabat - 1) ) * Nni;

            let P = math.pow(
                ( 1 + Yri * math.pow(state.U2, 2) * ( (state.diabat - 1) / (state.diabat * state.gaz * state.temperateGazEnter * Nni ) ) ),
                O
            );

            let Ni = O / (O - 1);

            let Ei = math.pow(P, 1 / Ni);

            state.stypensData[k].dataP.push(P);
            state.stypensData[k].dataY.push(Yri);
            state.stypensData[k].dataN.push(Nni);

            html += `<tr>
                <td>${i + 1}</td>
                <td>${P.toFixed(3)}</td>
                <td>${Yri.toFixed(3)}</td>
                <td>${Nni.toFixed(3)}</td>
                <td>${O.toFixed(3)}</td>
                <td>${Ei.toFixed(3)}</td>
            </tr>`;

        }

        html += '</table>';

    }

    $('.result-relation').html(html);

}

function step5() {

    let P = [];
    let N = [];

    let relationStypen = `<table class="table">
        <tr>
            <td>№ режима</td><td>П</td>
        </tr>`;
    let relationMode = `<table class="table">
       <tr>
        <td>№ режима</td><td>&eta;<sub>к</sub></td>
        </tr>`;

    for (let i = 0; i < 5; i++) {

        let currentP = 1;

        let currentYSum = 0;
        let currentDelitel = 0;

        for (let k = 0; k < state.stypensData.length; k++) {
            currentP *= state.stypensData[k].dataP[i];
        }

        for (let k = 0; k < state.stypensData.length; k++) {
            currentYSum += state.stypensData[k].dataY[i];
            currentDelitel += state.stypensData[k].dataY[i] / state.stypensData[k].dataN[i];
        }

        P.push(currentP.toFixed(2));
        N.push((currentYSum / currentDelitel).toFixed(2));

        relationStypen += `<tr><td>${i + 1}</td><td>${currentP.toFixed(2)}</td></tr>`;
        relationMode += `<tr><td>${i + 1}</td><td>${(currentYSum / currentDelitel).toFixed(2)}</td></tr>`;

    }

    relationStypen += `</table>`;
    relationMode += `</table>`;

    document.getElementById('relation-stypen').innerHTML = relationStypen;
    document.getElementById('kpd-relation-mode').innerHTML = relationMode;

    step6({
        N: N,
        P: P
    });

}

/**
 * графики
 */
function step6(data) {

    c3.generate({
        bindto: '#kpd',
        data: {
            xs: {
                'data1': 'x1',
                'data2': 'x2'
            },
            columns: [
                ['x1'].concat(state.Vn),
                ['x2'].concat(state.Vn),
                ['data1'].concat(data.P),
                ['data2'].concat(state.stypensData[0].dataN),
            ],
            type: 'spline'
        },
        zoom: {
            enabled: true
        },
        axis: {
            x: {
                max: 5,
                label: {
                    text: 'V',
                    position: 'outer-center'
                },
            },
            y: {
                max: 5,
                label: {
                    text: 'n, П',
                    position: 'outer-middle'
                },
            }
        },
        grid: {
            x: {
                show: true
            },
            y: {
                show: true
            }
        }
    });

    let graphics = document.getElementById('graphics');
    graphics.innerHTML = '';

    for (let i = 0; i < state.stypensData.length; i++) {

        let nameGraph = 'graph' + i;
        let graph = document.createElement('div');
        graph.setAttribute('id', nameGraph);

        let name = document.createElement('h3');
        name.innerText = `Для ${i + 1} ступени`;

        graphics.appendChild(name);
        graphics.appendChild(graph);

        c3.generate({
            bindto: '#' + nameGraph,
            data: {
                xs: {
                    'Y': 'x1',
                    'N': 'x2'
                },
                columns: [
                    ['x1'].concat(state.stypensData[i].koefRashoda),
                    ['x2'].concat(state.stypensData[i].koefRashoda),
                    ['Y'].concat(state.stypensData[i].polytronKdp),
                    ['N'].concat(state.stypensData[i].koefNapora),
                ],
                type: 'spline'
            },
            zoom: {
                enabled: true
            },
            axis: {
                x: {
                    label: {
                        text: 'Ф0',
                        position: 'outer-center'
                    }
                },
                y: {
                    max: 1,
                    label: {
                        text: 'n, Y',
                        position: 'outer-middle'
                    }
                }
            },
            grid: {
                x: {
                    show: true
                },
                y: {
                    show: true
                }
            }
        });
    }

}

function application() {
    generateTable(parseInt(state.countStypen));

    $('.data-count_stype').on('change', function () {
        let count = parseInt(this.value);
        state.countStypen = count;
        generateTable(count);
    });

    $('.calculate-app').on('click', function () {
        initData();

        step2();

        step3();

        step4();

        step5();

    });
}

application();