/**
 *
 * @type {{countStypen: number, gaz: number, diabat: number, gazEnter: number, temperateGazEnter: number, diametrWorkKolesa: number, angularSpeedRotor: number, koefFirstStypeNominal: number, stypensData: Array}}
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
    stypensData: []
};

/**
 * Генерация таблицы с вводом данных о ступени
 *
 * @param count
 */
function generateTable(count) {
    let html = '';

    for(let i = 0; i < count; i++) {
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
                                        <td>${data[i].koefsRashoda.a}</td>
                                    </tr>
                                    <tr>
                                        <td>b</td>
                                        <td>${data[i].koefsRashoda.b}</td>
                                    </tr>
                                    <tr>
                                        <td>c</td>
                                        <td>${data[i].koefsRashoda.c}</td>
                                    </tr>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <p>Для уравнения &Psi; = f(Ф<sub>0</sub>)</p>
                                <table class="table table-bordered">
                                    <tr>
                                        <td>a</td>
                                        <td>${data[i].koefsPolytropNapora.a}</td>
                                    </tr>
                                    <tr>
                                        <td>b</td>
                                        <td>${data[i].koefsPolytropNapora.b}</td>
                                    </tr>
                                    <tr>
                                        <td>c</td>
                                        <td>${data[i].koefsPolytropNapora.c}</td>
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
        + matrixCompare[1]      * matrix[2][1] * matrix[0][2]
        + matrix[0][1]          * matrix[1][2] * matrixCompare[2]
        - matrix[0][2]          * matrix[1][1] * matrixCompare[2]
        - matrixCompare[1]      * matrix[0][1] * matrix[2][2]
        - matrixCompare[0]      * matrix[2][1] * matrix[1][2];

    let det2 = matrix[0][0]     * matrixCompare[1]  * matrix[2][2]
        + matrix[1][0]          * matrixCompare[2]  * matrix[0][2]
        + matrixCompare[0]      * matrix[1][2]      * matrix[2][0]
        - matrix[0][2]          * matrixCompare[1]  * matrix[2][0]
        - matrix[1][0]          * matrixCompare[0]  * matrix[2][2]
        - matrix[0][0]          * matrixCompare[2]  * matrix[1][2];

    let det3 = matrix[0][0] * matrix[1][1]      * matrixCompare[2]
        + matrix[1][0]      * matrix[2][1]      * matrixCompare[0]
        + matrix[0][1]      * matrixCompare[1]  * matrix[2][0]
        - matrixCompare[0]  * matrix[1][1]      * matrix[2][0]
        - matrix[1][0]      * matrix[0][1]      * matrixCompare[2]
        - matrix[0][0]      * matrix[2][1]      * matrixCompare[1];

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

    let html = `<table class="table table-bordered">
<tr>
    <td>№ режима</td>
    <td>Объем. производ.</td>
</tr>`;

    for (let i = 0; i < 5; i++) {
        let a = math.eval('0.25 * ' + (i + 1) + ' + 0.25');
        let F0i = math.eval(a + ' * ' + state.koefFirstStypeNominal);

        let Vn = ( math.PI * math.pow(state.diametrWorkKolesa, 2) * U2 * F0i ) / 4;

        html += `<tr>
    <td>${i + 1}</td>
    <td>${Vn.toFixed(2)}</td>
</tr>
                `;
    }

    html += '</table>';

    $('.result-koef-rashoda').html(html);

}

function application() {
    generateTable( parseInt( state.countStypen ) );

    $('.data-count_stype').on('change', function () {
        let count = parseInt( this.value );
        state.countStypen = count;
        generateTable( count );
    });

    $('.calculate-app').on('click', function () {
        initData();

        step2();

        step3();

    });
}

application();