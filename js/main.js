// JavaScriptファイル全文

let sharedVacationData = {
    "required-days": 0,
    "required-people": 0,
    "required-total": 0
};

document.addEventListener("DOMContentLoaded", function () {
    initializePage();
    initializeShiftInputs(); // シフトデータの初期化を追加
    addVacationTableSwitcher(); // 休暇テーブル切り替え機能を追加
});

// 初期化関数
function initializePage() {
    console.log("ページ初期化開始");

    // データをロード
    loadData();
    loadVacationData(); // 追加: 休暇データの復元

    // 各種イベントリスナーを追加
    addEventListeners();
    addTableSwitcher();

    // 初期計算
    calculateTotalNurses();
    calculateCalendarDays();
    calculateMonthlySums();
    calculateVacationRequiredDays(); 

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
        const totalDays = parseInt(document.getElementById(`${row}-days`)?.value) || 0;
        const totalPeople = parseInt(document.getElementById(`${row}-people`)?.value) || 0;

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

        const requiredPlanField = document.getElementById(`${row}-required-plan`);
        const requiredResultField = document.getElementById(`${row}-required-result`);

        if (requiredPlanField) {
            const requiredPlanValue = (totalDays * totalPeople) - totalPlan;
            requiredPlanField.value = requiredPlanValue >= 0 ? requiredPlanValue : 0; // 負の値を防ぐ
        }
        
        if (requiredResultField) {
            const requiredResultValue = (totalDays * totalPeople) - totalResult;
            requiredResultField.value = requiredResultValue >= 0 ? requiredResultValue : 0; // 負の値を防ぐ
        }

        // 共通データを更新
        if (row === "vacation-summer") {
            sharedVacationData["required-days"] = totalDays;
            sharedVacationData["required-people"] = totalPeople;
            sharedVacationData["required-total"] = totalResult;
        }
    });

    console.log("「月ごとの休暇予定と実績」の計算完了");
}

//休暇テーブル切り替えで共通項目を更新する関数
function updateSharedVacationFields() {
    document.getElementById("vacation-summer-days").value = sharedVacationData["required-days"];
    document.getElementById("vacation-summer-people").value = sharedVacationData["required-people"];
    document.getElementById("vacation-summer-required-plan").value = sharedVacationData["required-total"];
    document.getElementById("vacation-summer-required-result").value = sharedVacationData["required-total"];
    console.log("共通フィールド更新完了");
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
                    shiftData[inputId] = input.value || 0; // 値を保存
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
            input.value = value; // 保存された値を復元
        }
    });
    console.log("シフトデータ復元完了");
}

//月ごとの休暇予定と実績データ保存
function saveVacationData() {
    const vacationData = {};
    document.querySelectorAll(".vacation-table input[type='number']").forEach(input => {
        vacationData[input.id] = input.value || 0;
    });

    // 共通データを保存
    sharedVacationData["required-days"] = document.getElementById("vacation-summer-days").value || 0;
    sharedVacationData["required-people"] = document.getElementById("vacation-summer-people").value || 0;
    sharedVacationData["required-total"] = document.getElementById("vacation-summer-required-plan").value || 0;

    localStorage.setItem("vacationData", JSON.stringify(vacationData));
    localStorage.setItem("sharedVacationData", JSON.stringify(sharedVacationData)); // 修正: 一貫して保存

    console.log("月ごとの休暇予定と実績データ保存完了");
}

//月ごとの休暇予定と実績データ復元
function loadVacationData() {
    const vacationData = JSON.parse(localStorage.getItem("vacationData")) || {};
    Object.entries(vacationData).forEach(([key, value]) => {
        const input = document.getElementById(key);
        if (input) input.value = value;
    });

    // sharedVacationDataを復元
    const sharedData = JSON.parse(localStorage.getItem("sharedVacationData")) || {
        "required-days": 0,
        "required-people": 0,
        "required-total": 0
    };
    sharedVacationData = sharedData;

    updateSharedVacationFields(); // 修正: 復元したデータを即時反映

    console.log("月ごとの休暇予定と実績データ復元完了");
}

// 初期化関数に保存と復元の処理を追加
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
            calculateVacationRequiredDays(); // 全月の「必要日数」再計算
        });
    });
    
    document.querySelectorAll(".vacation-table input[type='number']").forEach(input => {
        input.addEventListener("input", () => {
            saveVacationData(); // 休暇テーブルデータの保存
            calculateVacationRequiredDays();
        });
    });
    
    console.log("イベントリスナー追加完了");
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

// 「月ごとの休暇予定と実績」のテーブル切り替え機能
function addVacationTableSwitcher() {
    const prevButton = document.getElementById("vacation-prev-button");
    const nextButton = document.getElementById("vacation-next-button");
    const tablePeriod = document.getElementById("vacation-table-period");
    const table4To9 = document.getElementById("vacation-table-4-9");
    const table10To3 = document.getElementById("vacation-table-10-3");

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
        calculateVacationRequiredDays(); // 修正: 再計算を強制
        updateSharedVacationFields(); // 修正: 描画を更新
    }

    prevButton.addEventListener("click", toggleTables);
    nextButton.addEventListener("click", toggleTables);
}
