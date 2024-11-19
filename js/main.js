// JavaScriptファイル全文

document.addEventListener("DOMContentLoaded", function () {
    initializePage();
    addTableSwitcher(); // 月切り替えと休暇テーブル切り替え機能を統合
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

        // 月ごとの予定と実績の合計を計算
        ["apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec", "jan", "feb", "mar"].forEach(month => {
            planSum += parseInt(document.getElementById(`vacation-${category}-${month}-plan`)?.value) || 0;
            resultSum += parseInt(document.getElementById(`vacation-${category}-${month}-result`)?.value) || 0;
        });

        // 必要日数の計算
        const requiredPlan = (dayField * peopleField) - planSum;
        const requiredResult = (dayField * peopleField) - resultSum;

        // 計算結果を表示
        if (totalPlanField) totalPlanField.value = requiredPlan;
        if (totalResultField) totalResultField.value = requiredResult;
    });
}

// テーブル切り替え機能（統合）
function addTableSwitcher() {
    const vacationPrevButton = document.getElementById("vacation-prev-button");
    const vacationNextButton = document.getElementById("vacation-next-button");
    const vacationPeriod = document.getElementById("vacation-table-period");
    const table4To9 = document.getElementById("vacation-table-4-9");
    const table10To3 = document.getElementById("vacation-table-10-3");

    let currentTable = "4-9";

    function toggleTables() {
        if (currentTable === "4-9") {
            currentTable = "10-3";
            table4To9.classList.remove("active");
            table4To9.classList.add("hidden");
            table10To3.classList.remove("hidden");
            table10To3.classList.add("active");
            vacationPeriod.textContent = "10月〜3月";
        } else {
            currentTable = "4-9";
            table10To3.classList.remove("active");
            table10To3.classList.add("hidden");
            table4To9.classList.remove("hidden");
            table4To9.classList.add("active");
            vacationPeriod.textContent = "4月〜9月";
        }
    }

    vacationPrevButton.addEventListener("click", toggleTables);
    vacationNextButton.addEventListener("click", toggleTables);
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

// イベントリスナーを追加
function addEventListeners() {
    document.querySelectorAll("input[type='number']").forEach(input => {
        input.addEventListener("input", () => {
            calculateTotalNurses();
            calculateCalendarDays();
            calculateMonthlySums();
            calculateRequiredDays(); // 入力変更時に必要日数を再計算
            saveData();
        });
    });
    console.log("イベントリスナー追加完了");
}
