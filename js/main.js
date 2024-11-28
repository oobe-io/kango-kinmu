// メインのJavaScriptファイル

document.addEventListener("DOMContentLoaded", function () {
    initializePage();
    initializeShiftInputs();
    addVacationTableSwitcher();
    loadVacationData();
});

// 初期化関数
function initializePage() {
    console.log("ページ初期化開始");

    // データをロード
    loadData();

    // 各種イベントリスナーを追加
    addEventListeners();
    addTableSwitcher();

    // 初期計算
    calculateTotalNurses();
    calculateCalendarDays();
    calculateMonthlySums();
    calculateVacationRequiredDays();
    calculateWorkAndRestDays(); // 追加

    console.log("ページ初期化完了");
}

// 看護師数の計算
function calculateTotalNurses() {
    const months = [
        "apr", "may", "jun", "jul", "aug", "sep",
        "oct", "nov", "dec", "jan", "feb", "mar"
    ];

    let cumulativeTotal = 0;

    months.forEach(month => {
        const nurseCount = parseInt(document.getElementById(`nurse-count-${month}`)?.value) || 0;
        const retireCount = parseInt(document.getElementById(`retire-count-${month}`)?.value) || 0;
        const maternityCount = parseInt(document.getElementById(`maternity-count-${month}`)?.value) || 0;

        const totalCount = retireCount + maternityCount;
        const totalField = document.getElementById(`total-count-${month}`);
        if (totalField) totalField.value = totalCount;

        cumulativeTotal += totalCount;

        const totalNurseField = document.getElementById(`total-nurse-${month}`);
        if (totalNurseField) {
            if (nurseCount === 0) {
                totalNurseField.value = "";
            } else {
                totalNurseField.value = nurseCount - cumulativeTotal;
            }
        }
    });
}

// 暦日計算
function calculateCalendarDays() {
    const months = [
        "apr", "may", "jun", "jul", "aug", "sep",
        "oct", "nov", "dec", "jan", "feb", "mar"
    ];

    months.forEach(month => {
        const weekday = parseInt(document.getElementById(`weekday-${month}`)?.value) || 0;
        const holiday = parseInt(document.getElementById(`holiday-${month}`)?.value) || 0;

        const calendarField = document.getElementById(`calendar-${month}`);
        if (calendarField) calendarField.value = weekday + holiday;
    });
}

// 月ごとの予定勤務者数の計算
function calculateMonthlySums() {
    const months = [
        "apr", "may", "jun", "jul", "aug", "sep",
        "oct", "nov", "dec", "jan", "feb", "mar"
    ];

    months.forEach(month => {
        const shiftTypes = ["night-shift", "off-duty", "short-shift", "late-shift", "managerial-shift", "day-shift"];
        let weekdayTotal = 0;
        let holidayTotal = 0;

        shiftTypes.forEach(type => {
            const weekdayShift = parseInt(document.getElementById(`${type}-${month}-weekday`)?.value) || 0;
            const holidayShift = parseInt(document.getElementById(`${type}-${month}-holiday`)?.value) || 0;

            weekdayTotal += weekdayShift;
            holidayTotal += holidayShift;
        });

        const totalWeekdayField = document.getElementById(`total-${month}-weekday`);
        if (totalWeekdayField) totalWeekdayField.value = weekdayTotal;

        const totalHolidayField = document.getElementById(`total-${month}-holiday`);
        if (totalHolidayField) totalHolidayField.value = holidayTotal;
    });
}

// 「月ごとの休暇予定と実績」の計算
function calculateVacationRequiredDays() {
    const vacationRows = [
        "vacation-summer",
        "vacation-legal5",
        "vacation-sick",
        "vacation-other",
        "vacation-special",
        "vacation-night",
        "vacation-rotation",
        "vacation-student",
        "vacation-year1year3"
    ];

    vacationRows.forEach(row => {
        // 両方のテーブルの日数・人数を取得
        const days4to9 = document.getElementById(`${row}-days`);
        const days10to3 = document.querySelector(`#vacation-table-10-3 [data-row="${row}-days"]`);
        const people4to9 = document.getElementById(`${row}-people`);
        const people10to3 = document.querySelector(`#vacation-table-10-3 [data-row="${row}-people"]`);

        // 最新の値を取得
        const daysValue = parseInt(days4to9?.value || days10to3?.value) || 0;
        const peopleValue = parseInt(people4to9?.value || people10to3?.value) || 0;

        // 両方のテーブルの値を同期
        if (days4to9) days4to9.value = daysValue;
        if (days10to3) days10to3.value = daysValue;
        if (people4to9) people4to9.value = peopleValue;
        if (people10to3) people10to3.value = peopleValue;

        let totalPlan = 0;
        let totalResult = 0;

        const months = [
            "apr", "may", "jun", "jul", "aug", "sep",
            "oct", "nov", "dec", "jan", "feb", "mar"
        ];

        months.forEach(month => {
            const planField = document.getElementById(`${row}-${month}-plan`);
            const resultField = document.getElementById(`${row}-${month}-result`);

            if (planField) {
                totalPlan += parseInt(planField.value) || 0;
            }

            if (resultField) {
                totalResult += parseInt(resultField.value) || 0;
            }
        });

        // 必要日数の計算と更新
        const requiredPlanValue = Math.max(0, (daysValue * peopleValue) - totalPlan);
        const requiredResultValue = Math.max(0, (daysValue * peopleValue) - totalResult);

        // 両方のテーブルの必要日数を更新
        const requiredPlan4to9 = document.getElementById(`${row}-required-plan`);
        const requiredPlan10to3 = document.querySelector(`#vacation-table-10-3 [data-row="${row}-required-plan"]`);
        const requiredResult4to9 = document.getElementById(`${row}-required-result`);
        const requiredResult10to3 = document.querySelector(`#vacation-table-10-3 [data-row="${row}-required-result"]`);

        if (requiredPlan4to9) requiredPlan4to9.value = requiredPlanValue;
        if (requiredPlan10to3) requiredPlan10to3.value = requiredPlanValue;
        if (requiredResult4to9) requiredResult4to9.value = requiredResultValue;
        if (requiredResult10to3) requiredResult10to3.value = requiredResultValue;
    });

    console.log("「月ごとの休暇予定と実績」の計算完了");
}

// 必要公休数、可能勤務数、投入勤務数の計算
function calculateWorkAndRestDays() {
    const months = [
        "apr", "may", "jun", "jul", "aug", "sep",
        "oct", "nov", "dec", "jan", "feb", "mar"
    ];

    months.forEach(month => {
        // 看護師総数の取得
        const totalNurseField = document.getElementById(`total-nurse-${month}`);
        const totalNurses = parseInt(totalNurseField?.value) || 0;

        // 平日と休日の取得
        const weekdayField = document.getElementById(`weekday-${month}`);
        const holidayField = document.getElementById(`holiday-${month}`);
        const weekdays = parseInt(weekdayField?.value) || 0;
        const holidays = parseInt(holidayField?.value) || 0;

        // 必要公休数の計算
        const requiredRestDays = totalNurses * holidays;
        const requiredRestDaysField = document.getElementById(`required-rest-days-${month}`);
        if (requiredRestDaysField) requiredRestDaysField.value = requiredRestDays;

        // 可能勤務数の計算
        const possibleWorkDays = totalNurses * weekdays;
        const possibleWorkDaysField = document.getElementById(`possible-work-days-${month}`);
        if (possibleWorkDaysField) possibleWorkDaysField.value = possibleWorkDays;

        // 月ごとの予定勤務者数の総和の取得
        const totalWeekdayWorkersField = document.getElementById(`total-${month}-weekday`);
        const totalHolidayWorkersField = document.getElementById(`total-${month}-holiday`);
        const totalWeekdayWorkers = parseInt(totalWeekdayWorkersField?.value) || 0;
        const totalHolidayWorkers = parseInt(totalHolidayWorkersField?.value) || 0;

        // 投入勤務数の計算
        const deployedWorkDays = (totalWeekdayWorkers * weekdays) + (totalHolidayWorkers * holidays);
        const deployedWorkDaysField = document.getElementById(`deployed-work-days-${month}`);
        if (deployedWorkDaysField) deployedWorkDaysField.value = deployedWorkDays;
    });
}

// ローカルストレージからデータを読み込む
function loadData() {
    const storedData = JSON.parse(localStorage.getItem("nurseCounts")) || {};
    Object.entries(storedData).forEach(([key, value]) => {
        const input = document.getElementById(key);
        if (input) input.value = value;
    });
    console.log("データロード完了");
}

// データ保存
function saveData() {
    const months = [
        "apr", "may", "jun", "jul", "aug", "sep",
        "oct", "nov", "dec", "jan", "feb", "mar"
    ];

    const nurseCounts = {};

    months.forEach(month => {
        nurseCounts[`nurse-count-${month}`] = document.getElementById(`nurse-count-${month}`)?.value || 0;
        nurseCounts[`retire-count-${month}`] = document.getElementById(`retire-count-${month}`)?.value || 0;
        nurseCounts[`maternity-count-${month}`] = document.getElementById(`maternity-count-${month}`)?.value || 0;
        nurseCounts[`weekday-${month}`] = document.getElementById(`weekday-${month}`)?.value || 0;
        nurseCounts[`holiday-${month}`] = document.getElementById(`holiday-${month}`)?.value || 0;
    });

    localStorage.setItem("nurseCounts", JSON.stringify(nurseCounts));
    console.log("データ保存完了");
}

// シフトデータ保存
function saveShiftData() {
    const months = ["apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec", "jan", "feb", "mar"];
    const shiftTypes = ["night-shift", "off-duty", "short-shift", "late-shift", "managerial-shift", "day-shift", "total"];
    const shiftData = {};

    months.forEach(month => {
        shiftTypes.forEach(type => {
            ["weekday", "holiday"].forEach(shiftCategory => {
                const inputId = `${type}-${month}-${shiftCategory}`;
                const input = document.getElementById(inputId);
                if (input) {
                    shiftData[inputId] = input.value || 0;
                }
            });
        });
    });

    localStorage.setItem("shiftData", JSON.stringify(shiftData));
    console.log("シフトデータ保存完了");
}

// シフトデータ復元
function loadShiftData() {
    const shiftData = JSON.parse(localStorage.getItem("shiftData")) || {};
    Object.entries(shiftData).forEach(([key, value]) => {
        const input = document.getElementById(key);
        if (input) {
            input.value = value;
        }
    });
    console.log("シフトデータ復元完了");
}

// 月ごとの休暇予定と実績データ保存
function saveVacationData() {
    const vacationData = {
        tableState: document.getElementById("vacation-table-4-9").classList.contains("active") ? "4-9" : "10-3",
        values: {},
        commonData: {}
    };

    // すべての入力フィールドの値を保存
    document.querySelectorAll(".vacation-table input[type='number']").forEach(input => {
        vacationData.values[input.id] = input.value || 0;
    });

    // 共通データ（日数と人数）の保存
    const vacationRows = [
        "vacation-summer",
        "vacation-legal5",
        "vacation-sick",
        "vacation-other",
        "vacation-special",
        "vacation-night",
        "vacation-rotation",
        "vacation-student",
        "vacation-year1year3"
    ];

    vacationRows.forEach(row => {
        vacationData.commonData[`${row}-days`] = document.getElementById(`${row}-days`)?.value || 0;
        vacationData.commonData[`${row}-people`] = document.getElementById(`${row}-people`)?.value || 0;
        // 必要日数の保存
        vacationData.commonData[`${row}-required-plan`] = document.getElementById(`${row}-required-plan`)?.value || 0;
        vacationData.commonData[`${row}-required-result`] = document.getElementById(`${row}-required-result`)?.value || 0;
    });

    // ローカルストレージに保存
    localStorage.setItem("vacationData", JSON.stringify(vacationData));
    console.log("月ごとの休暇予定と実績データ保存完了");
}

// 月ごとの休暇予定と実績データ復元
function loadVacationData() {
    const storedData = JSON.parse(localStorage.getItem("vacationData")) || {
        tableState: "4-9",
        values: {},
        commonData: {}
    };

    // まず4月〜9月テーブルをアクティブに設定
    const table4To9 = document.getElementById("vacation-table-4-9");
    const table10To3 = document.getElementById("vacation-table-10-3");
    const tablePeriod = document.getElementById("vacation-table-period");

    // 強制的に4月〜9月を表示
    table4To9.classList.remove("hidden");
    table4To9.classList.add("active");
    table10To3.classList.add("hidden");
    table10To3.classList.remove("active");
    tablePeriod.textContent = "4月〜9月";

    // 共通データの復元（両方のテーブルに適用）
    if (storedData.commonData) {
        const vacationRows = [
            "vacation-summer",
            "vacation-legal5",
            "vacation-sick",
            "vacation-other",
            "vacation-special",
            "vacation-night",
            "vacation-rotation",
            "vacation-student",
            "vacation-year1year3"
        ];

        vacationRows.forEach(row => {
            // 日数と人数の設定
            const daysValue = storedData.commonData[`${row}-days`] || '';
            const peopleValue = storedData.commonData[`${row}-people`] || '';
            const requiredPlanValue = storedData.commonData[`${row}-required-plan`] || '';
            const requiredResultValue = storedData.commonData[`${row}-required-result`] || '';

            // 4月〜9月テーブルの設定
            const days4to9 = document.getElementById(`${row}-days`);
            const people4to9 = document.getElementById(`${row}-people`);
            const requiredPlan4to9 = document.getElementById(`${row}-required-plan`);
            const requiredResult4to9 = document.getElementById(`${row}-required-result`);

            if (days4to9) days4to9.value = daysValue;
            if (people4to9) people4to9.value = peopleValue;
            if (requiredPlan4to9) requiredPlan4to9.value = requiredPlanValue;
            if (requiredResult4to9) requiredResult4to9.value = requiredResultValue;

            // 10月〜3月テーブルの設定
            const days10to3 = document.querySelector(`#vacation-table-10-3 [data-row="${row}-days"]`);
            const people10to3 = document.querySelector(`#vacation-table-10-3 [data-row="${row}-people"]`);
            const requiredPlan10to3 = document.querySelector(`#vacation-table-10-3 [data-row="${row}-required-plan"]`);
            const requiredResult10to3 = document.querySelector(`#vacation-table-10-3 [data-row="${row}-required-result"]`);

            if (days10to3) days10to3.value = daysValue;
            if (people10to3) people10to3.value = peopleValue;
            if (requiredPlan10to3) requiredPlan10to3.value = requiredPlanValue;
            if (requiredResult10to3) requiredResult10to3.value = requiredResultValue;
        });
    }

    // 月別データの復元
    if (storedData.values) {
        Object.entries(storedData.values).forEach(([key, value]) => {
            const input = document.getElementById(key);
            if (input) input.value = value;
        });
    }

    // 必要日数を再計算
    calculateVacationRequiredDays();
    console.log("月ごとの休暇予定と実績データ復元完了");
}

// シフト入力の初期化
function initializeShiftInputs() {
    loadShiftData();

    // 各シフト入力に保存用イベントリスナーを追加
    const inputs = document.querySelectorAll(".shift-input");
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            saveShiftData();
        });
    });

    console.log("シフト入力の初期化完了");
}

// イベントリスナーを追加
function addEventListeners() {
    document.querySelectorAll("input[type='number']").forEach(input => {
        input.addEventListener("input", () => {
            calculateTotalNurses();
            calculateCalendarDays();
            calculateMonthlySums();
            saveData();
            calculateVacationRequiredDays();
            calculateWorkAndRestDays(); 
        });
    });

    // 両方のテーブルの入力フィールドにイベントリスナーを追加
    document.querySelectorAll(".vacation-table input[type='number']").forEach(input => {
        input.addEventListener("input", () => {
            // 「日」「人」の入力値を同期
            if (input.hasAttribute('data-row')) {
                const rowId = input.getAttribute('data-row');
                const otherTableInput = document.querySelector(
                    `.vacation-table ${input.closest('#vacation-table-4-9') ? 
                    '#vacation-table-10-3' : '#vacation-table-4-9'} [data-row="${rowId}"]`
                );
                if (otherTableInput) {
                    otherTableInput.value = input.value;
                }
            }
            saveVacationData();
            calculateVacationRequiredDays();
        });
    });
}

// 「月ごとの予定勤務者数を入力」のテーブル切り替え機能
function addTableSwitcher() {
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");
    const tablePeriod = document.getElementById("table-period");
    const table4To9 = document.getElementById("table-4-9");
    const table10To3 = document.getElementById("table-10-3");

    let currentTable = "4-9";

    table4To9.classList.add("active");
    table10To3.classList.add("hidden");

    function toggleTables() {
        if (currentTable === "4-9") {
            currentTable = "10-3";
            table4To9.classList.remove("active");
            table4To9.classList.add("hidden");
            table10To3.classList.remove("hidden");
            table10To3.classList.add("active");
            tablePeriod.textContent = "10月〜3月";
        } else {
            currentTable = "4-9";
            table10To3.classList.remove("active");
            table10To3.classList.add("hidden");
            table4To9.classList.remove("hidden");
            table4To9.classList.add("active");
            tablePeriod.textContent = "4月〜9月";
        }
        console.log("切り替え完了:", currentTable);
        calculateVacationRequiredDays();
    }

    prevButton.addEventListener("click", toggleTables);
    nextButton.addEventListener("click", toggleTables);
}

// 休暇テーブル切り替え機能
function addVacationTableSwitcher() {
    const prevButton = document.getElementById("vacation-prev-button");
    const nextButton = document.getElementById("vacation-next-button");

    function toggleTables() {
        const table4To9 = document.getElementById("vacation-table-4-9");
        const table10To3 = document.getElementById("vacation-table-10-3");
        const tablePeriod = document.getElementById("vacation-table-period");

        // 現在のデータを保存
        saveVacationData();

        if (table4To9.classList.contains("active")) {
            // 4月〜9月から10月〜3月への切り替え
            table4To9.classList.remove("active");
            table4To9.classList.add("hidden");
            table10To3.classList.remove("hidden");
            table10To3.classList.add("active");
            tablePeriod.textContent = "10月〜3月";

            // 共通データを10月〜3月テーブルに明示的に適用
            const storedData = JSON.parse(localStorage.getItem("vacationData"));
            if (storedData && storedData.commonData) {
                const vacationRows = [
                    "vacation-summer",
                    "vacation-legal5",
                    "vacation-sick",
                    "vacation-other",
                    "vacation-special",
                    "vacation-night",
                    "vacation-rotation",
                    "vacation-student",
                    "vacation-year1year3"
                ];

                vacationRows.forEach(row => {
                    const days = document.querySelector(`#vacation-table-10-3 [data-row="${row}-days"]`);
                    const people = document.querySelector(`#vacation-table-10-3 [data-row="${row}-people"]`);
                    const requiredPlan = document.querySelector(`#vacation-table-10-3 [data-row="${row}-required-plan"]`);
                    const requiredResult = document.querySelector(`#vacation-table-10-3 [data-row="${row}-required-result"]`);

                    if (days) days.value = storedData.commonData[`${row}-days`] || '';
                    if (people) people.value = storedData.commonData[`${row}-people`] || '';
                    if (requiredPlan) requiredPlan.value = storedData.commonData[`${row}-required-plan`] || '';
                    if (requiredResult) requiredResult.value = storedData.commonData[`${row}-required-result`] || '';
                });
            }
        } else {
            // 10月〜3月から4月〜9月への切り替え
            table10To3.classList.remove("active");
            table10To3.classList.add("hidden");
            table4To9.classList.remove("hidden");
            table4To9.classList.add("active");
            tablePeriod.textContent = "4月〜9月";
        }

        // 必要日数を再計算
        calculateVacationRequiredDays();
        console.log("テーブル切り替え完了");
    }

    prevButton.addEventListener("click", toggleTables);
    nextButton.addEventListener("click", toggleTables);
}
