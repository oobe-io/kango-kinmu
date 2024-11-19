document.addEventListener("DOMContentLoaded", function () {
    initializePage();
    addVacationTableSwitcher();
    addMonthlyWorkforceTableSwitcher(); // 月ごとの予定勤務者数切り替え機能を追加
});

// 初期化関数
function initializePage() {
    console.log("ページ初期化開始");

    // データをロード
    loadData();

    // 各種イベントリスナーを追加
    addEventListeners();

    // 初期計算
    calculateTotalNurses();
    calculateCalendarDays();
    calculateMonthlySums();
    calculateRequiredDays();

    console.log("ページ初期化完了");
}

// データのロード
function loadData() {
    const storedData = JSON.parse(localStorage.getItem("vacationData")) || {};
    Object.entries(storedData).forEach(([key, value]) => {
        const input = document.getElementById(key);
        if (input) input.value = value;
    });
    console.log("データロード完了");
}

// データの保存
function saveData() {
    const inputs = document.querySelectorAll("input[type='number']");
    const vacationData = {};

    inputs.forEach(input => {
        if (input.id) {
            vacationData[input.id] = input.value;
        }
    });

    localStorage.setItem("vacationData", JSON.stringify(vacationData));
    console.log("データ保存完了");
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

// 月ごとの平日・休日の総和
function calculateMonthlySums() {
    const months = [
        "apr", "may", "jun", "jul", "aug", "sep",
        "oct", "nov", "dec", "jan", "feb", "mar"
    ];

    months.forEach(month => {
        const shiftTypes = ["night", "off-duty", "short", "late", "managerial", "day"];
        let weekdayTotal = 0;
        let holidayTotal = 0;

        shiftTypes.forEach(type => {
            const weekdayShift = parseInt(document.getElementById(`${type}-shift-${month}-weekday`)?.value) || 0;
            const holidayShift = parseInt(document.getElementById(`${type}-shift-${month}-holiday`)?.value) || 0;

            weekdayTotal += weekdayShift;
            holidayTotal += holidayShift;
        });

        const totalWeekdayField = document.getElementById(`total-${month}-weekday`);
        if (totalWeekdayField) totalWeekdayField.value = weekdayTotal;

        const totalHolidayField = document.getElementById(`total-${month}-holiday`);
        if (totalHolidayField) totalHolidayField.value = holidayTotal;
    });
}

// 必要日数の計算
function calculateRequiredDays() {
    const categories = [
        "summer", "legal5", "sick", "other", "special",
        "night", "rotation", "student", "year1year3"
    ];

    categories.forEach(category => {
        const totalPlanField = document.getElementById(`vacation-${category}-required-plan`);
        const totalResultField = document.getElementById(`vacation-${category}-required-result`);

        const dayField = parseInt(document.getElementById(`vacation-${category}-days`)?.value) || 0;
        const peopleField = parseInt(document.getElementById(`vacation-${category}-people`)?.value) || 0;

        let planSum = 0;
        let resultSum = 0;

        ["apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec", "jan", "feb", "mar"].forEach(month => {
            planSum += parseInt(document.getElementById(`vacation-${category}-${month}-plan`)?.value) || 0;
            resultSum += parseInt(document.getElementById(`vacation-${category}-${month}-result`)?.value) || 0;
        });

        const requiredPlan = (dayField * peopleField) - planSum;
        const requiredResult = (dayField * peopleField) - resultSum;

        if (totalPlanField) totalPlanField.value = requiredPlan;
        if (totalResultField) totalResultField.value = requiredResult;
    });
}

// 月ごとの休暇予定と実績切り替え機能
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
    }

    prevButton.addEventListener("click", toggleTables);
    nextButton.addEventListener("click", toggleTables);
}

// 月ごとの予定勤務者数入力切り替え機能
function addMonthlyWorkforceTableSwitcher() {
    const prevButton = document.getElementById("workforce-prev-button");
    const nextButton = document.getElementById("workforce-next-button");
    const table4To9 = document.getElementById("workforce-table-4-9");
    const table10To3 = document.getElementById("workforce-table-10-3");

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
        } else {
            currentTable = "4-9";
            table10To3.classList.remove("active");
            table10To3.classList.add("hidden");
            table4To9.classList.remove("hidden");
            table4To9.classList.add("active");
        }
    }

    prevButton.addEventListener("click", toggleTables);
    nextButton.addEventListener("click", toggleTables);
}

// イベントリスナーを追加
function addEventListeners() {
    const inputs = document.querySelectorAll("input[type='number']");
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            calculateTotalNurses();
            calculateCalendarDays();
            calculateMonthlySums();
            calculateRequiredDays();
            saveData();
        });
    });
    console.log("イベントリスナー追加完了");
}

// 初期計算関数
function calculateInitialValues() {
    calculateTotalNurses();
    calculateCalendarDays();
    calculateMonthlySums();
    calculateRequiredDays();
}

// 他の初期化処理や必要な追加関数があればここに記載

