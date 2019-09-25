const state = {
    countStage: 1,

    // Газовая постоянная
    gaz: 0,

    // Показатель адиабаты
    adiabats: 0,

    // Давление газа на входе
    pressureGazOnEnter: 0,

    // Температура газа на входе
    temperateGazOnEnter: 0,


    // Диаметр рабочего колеса
    diameterWorkWheels: 0,

    // Угловая скорость вращения ротора
    angularRotationSpeedRotor: 0,

    // Усл. коеф. расхода 1-й ступени на ном. режиме
    coefficientFirstStageNominal: 0,

    // ступени
    stagesData: [],

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
function generateTableCoefficientStep2(data) {
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
    const det = math.det(matrix);

    const det1 = matrixCompare[0] * matrix[1][1] * matrix[2][2]
        + matrixCompare[1] * matrix[2][1] * matrix[0][2]
        + matrix[0][1] * matrix[1][2] * matrixCompare[2]
        - matrix[0][2] * matrix[1][1] * matrixCompare[2]
        - matrixCompare[1] * matrix[0][1] * matrix[2][2]
        - matrixCompare[0] * matrix[2][1] * matrix[1][2];

    const det2 = matrix[0][0] * matrixCompare[1] * matrix[2][2]
        + matrix[1][0] * matrixCompare[2] * matrix[0][2]
        + matrixCompare[0] * matrix[1][2] * matrix[2][0]
        - matrix[0][2] * matrixCompare[1] * matrix[2][0]
        - matrix[1][0] * matrixCompare[0] * matrix[2][2]
        - matrix[0][0] * matrixCompare[2] * matrix[1][2];

    const det3 = matrix[0][0] * matrix[1][1] * matrixCompare[2]
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

    const Fi0Square = [
        Math.pow(Fi0[0], 2),
        Math.pow(Fi0[1], 2),
        Math.pow(Fi0[2], 2),
    ];

    const matrix = [[], [], []];

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
function getStagesData() {

    const stages = [];

    for (let i = 0; i < state.countStage; i++) {

        let stage = {coefficientConsumption: [], polytropicKdp: [], coefficientPressure: []};

        $(`.data-koef-rasxod-styp${i}`).each((index, item) => {
            stage.coefficientConsumption.push(parseFloat($(item).val()));
        });

        $(`.data-polytron-kpd-kolesa-styp${i}`).each((index, item) => {
            stage.polytropicKdp.push(parseFloat($(item).val()));
        });

        $(`.data-koef-polytron-napora-styp${i}`).each((index, item) => {
            stage.coefficientPressure.push(parseFloat($(item).val()));
        });

        stages.push(stage);

    }

    return stages;

}

/**
 * Инициализация входных данных & построение структуры ступеней
 */
function initData() {
    state.gaz = parseFloat($('.data-gaz').val());
    state.adiabats = parseFloat($('.data-diabat').val());
    state.pressureGazOnEnter = parseFloat($('.data-gaz-enter').val());
    state.temperateGazOnEnter = parseFloat($('.data-temperature-gaz-enter').val());

    state.diameterWorkWheels = parseFloat($('.data-diametr-work-kolesa').val());
    state.angularRotationSpeedRotor = parseFloat($('.data-angular-speed-rotor').val());
    state.coefficientFirstStageNominal = parseFloat($('.data-koef_first_stype_nominal').val());

    state.stagesData = getStagesData();
}

/**
 * Определение коэффициентов уравнений
 */
function detectCoefficientEquations() {
    for (let i = 0; i < state.stagesData.length; i++) {

        // коэф. расхода Ф0
        const aF = createDMatrixKramer(state.stagesData[i].coefficientConsumption, state.stagesData[i].polytropicKdp);

        // коэф. политропного напора Ψ0
        const aY = createDMatrixKramer(state.stagesData[i].coefficientConsumption, state.stagesData[i].coefficientPressure);

        state.stagesData[i].koefsRashoda = aF.result;
        state.stagesData[i].koefsPolytropNapora = aY.result;
    }

    generateTableCoefficientStep2(state.stagesData);
}

/**
 * Расчет  производительности  комрессора на входе
 */
function calcPerformanceCompressor() {
    const U2 = math.eval(`(${state.angularRotationSpeedRotor} * ${state.diameterWorkWheels}) / 2`);

    state.U2 = U2;

    let html = `<table class="table table-bordered">
<tr>
    <td>№ режима</td>
    <td>Объем. производ.</td>
</tr>`;

    for (let i = 0; i < 5; i++) {
        let a = math.eval('0.25 * ' + (i + 1) + ' + 0.25');
        let F0i = math.eval(a + ' * ' + state.coefficientFirstStageNominal);

        state.Foi.push(F0i);

        let Vn = ( math.PI * math.pow(state.diameterWorkWheels, 2) * U2 * F0i ) / 4;

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
function calcRelationPressureFirstStage() {

    let html = '';

    for (let k = 0; k < state.stagesData.length; k++) {

        html += `<table class="table table-bordered">
                <tr>
                    <td>№ режима</td>
                    <td>П</td>
                    <td>&Psi;<sub>ni</sub></td>
                    <td>&eta;<sub>ni</sub></td>
                    <td>&oacute;<sub>i</sub></td>
                    <td>E</td>
                </tr>`;

        state.stagesData[k].dataP = [];
        state.stagesData[k].dataY = [];
        state.stagesData[k].dataN = [];

        for (let i = 0; i < 5; i++) {

            const Yri = state.stagesData[k].koefsPolytropNapora.a
                + state.stagesData[k].koefsPolytropNapora.b
                * state.Foi[i]
                + state.stagesData[k].koefsPolytropNapora.c
                * math.pow(state.Foi[i], 2);

            const Nni = state.stagesData[k].koefsRashoda.a
                + state.stagesData[k].koefsRashoda.b
                * state.Foi[i]
                + state.stagesData[k].koefsRashoda.c
                * math.pow(state.Foi[i], 2);

            const O = ( state.adiabats / (state.adiabats - 1) ) * Nni;

            const P = math.pow(
                ( 1 + Yri * math.pow(state.U2, 2) * ( (state.adiabats - 1) / (state.adiabats * state.gaz * state.temperateGazOnEnter * Nni ) ) ),
                O
            );

            const Ni = O / (O - 1);

            const Ei = math.pow(P, 1 / Ni);

            state.stagesData[k].dataP.push(P);
            state.stagesData[k].dataY.push(Yri);
            state.stagesData[k].dataN.push(Nni);

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

    const P = [];
    const N = [];
    const { stagesData } = state;

    let relationStage = `<table class="table">
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
        let currentDivider = 0;

        for (let k = 0; k < stagesData.length; k++) {
            currentP *= stagesData[k].dataP[i];
            currentYSum += stagesData[k].dataY[i];
            currentDivider += stagesData[k].dataY[i] / stagesData[k].dataN[i];
        }

        P.push(currentP.toFixed(2));
        N.push((currentYSum / currentDivider).toFixed(2));

        relationStage += `<tr><td>${i + 1}</td><td>${currentP.toFixed(2)}</td></tr>`;
        relationMode += `<tr><td>${i + 1}</td><td>${(currentYSum / currentDivider).toFixed(2)}</td></tr>`;

    }

    relationStage += `</table>`;
    relationMode += `</table>`;

    document.getElementById('relation-stypen').innerHTML = relationStage;
    document.getElementById('kpd-relation-mode').innerHTML = relationMode;

    step6({ N, P });

}

/**
 * графики
 */
function step6(data) {
    const {
        Vn,
        stagesData,
    } = state;

    c3.generate({
        bindto: '#kpd',
        data: {
            xs: {
                'data1': 'x1',
                'data2': 'x2'
            },
            columns: [
                ['x1'].concat(Vn),
                ['x2'].concat(Vn),
                ['data1'].concat(data.P),
                ['data2'].concat(stagesData[0].dataN),
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

    const graphics = document.getElementById('graphics');
    graphics.innerHTML = '';

    for (let i = 0; i < stagesData.length; i++) {

        const nameGraph = 'graph' + i;
        const graph = document.createElement('div');
        graph.setAttribute('id', nameGraph);

        const name = document.createElement('h3');
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
                    ['x1'].concat(stagesData[i].coefficientConsumption),
                    ['x2'].concat(stagesData[i].coefficientConsumption),
                    ['Y'].concat(stagesData[i].polytropicKdp),
                    ['N'].concat(stagesData[i].coefficientPressure),
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
    generateTable(parseInt(state.countStage));

    $('.data-count_stype').on('change', () => {
        const count = parseInt(this.value);
        state.countStage = count;
        generateTable(count);
    });

    $('.calculate-app').on('click', () => {
        initData();

        detectCoefficientEquations();

        calcPerformanceCompressor();

        calcRelationPressureFirstStage();

        step5();

    });
}

application();
