// 看護師総数を計算する関数
function calculateTotalNurses() {
    const months = [
        "apr", "may", "jun", "jul", "aug", "sep",
        "oct", "nov", "dec", "jan", "feb", "mar"
    ];

    let cumulativeTotal = 0;

    months.forEach(month => {
        const nurseCount = parseInt(document.getElementById(`nurse-count-${month}`).value) || 0;
        const retireCount = parseInt(document.getElementById(`retire-count-${month}`).value) || 0;
        const maternityCount = parseInt(document.getElementById(`maternity-count-${month}`).value) || 0;

        const totalCount = retireCount + maternityCount;
        document.getElementById(`total-count-${month}`).value = totalCount;

        cumulativeTotal += totalCount;

        if (nurseCount === 0) {
            document.getElementById(`total-nurse-${month}`).value = "";
        } else {
            const totalNurse = nurseCount - cumulativeTotal;
            document.getElementById(`total-nurse-${month}`).value = totalNurse;
        }
    });
}

// 暦日を計算する関数
function calculateCalendarDays() {
    const months = [
        "apr", "may", "jun", "jul", "aug", "sep",
        "oct", "nov", "dec", "jan", "feb", "mar"
    ];

    months.forEach(month => {
        const weekday = parseInt(document.getElementById(`weekday-${month}`).value) || 0;
        const holiday = parseInt(document.getElementById(`holiday-${month}`).value) || 0;
        const calendarDays = weekday + holiday;
        document.getElementById(`calendar-${month}`).value = calendarDays;
    });
}

// シフトの総和を計算して表示する関数
function calculateShiftTotals() {
    const months = [
        "apr", "may", "jun", "jul", "aug", "sep",
        "oct", "nov", "dec", "jan", "feb", "mar"
    ];

    months.forEach(month => {
        let weekdayTotal = 0;
        let holidayTotal = 0;

        const shiftTypes = ["night", "off-duty", "short", "late", "managerial", "day"];
        shiftTypes.forEach(type => {
            const weekdayValue = parseInt(document.getElementById(`${type}-shift-${month}-weekday`).value) || 0;
            const holidayValue = parseInt(document.getElementById(`${type}-shift-${month}-holiday`).value) || 0;

            weekdayTotal += weekdayValue;
            holidayTotal += holidayValue;
        });

        document.getElementById(`total-${month}-weekday`).value = weekdayTotal;
        document.getElementById(`total-${month}-holiday`).value = holidayTotal;
    });
}

// データをローカルストレージに保存する関数
function saveData() {
    const months = [
        "apr", "may", "jun", "jul", "aug", "sep",
        "oct", "nov", "dec", "jan", "feb", "mar"
    ];
    const data = {};

    months.forEach(month => {
        data[`nurse-count-${month}`] = document.getElementById(`nurse-count-${month}`).value || 0;
        data[`retire-count-${month}`] = document.getElementById(`retire-count-${month}`).value || 0;
        data[`maternity-count-${month}`] = document.getElementById(`maternity-count-${month}`).value || 0;
        data[`weekday-${month}`] = document.getElementById(`weekday-${month}`).value || 0;
        data[`holiday-${month}`] = document.getElementById(`holiday-${month}`).value || 0;

        const shiftTypes = ["night", "off-duty", "short", "late", "managerial", "day"];
        shiftTypes.forEach(type => {
            data[`${type}-shift-${month}-weekday`] = document.getElementById(`${type}-shift-${month}-weekday`).value || 0;
            data[`${type}-shift-${month}-holiday`] = document.getElementById(`${type}-shift-${month}-holiday`).value || 0;
        });
    });

    localStorage.setItem("nurseData", JSON.stringify(data));
}

// ローカルストレージからデータを読み込む関数
function loadData() {
    const storedData = JSON.parse(localStorage.getItem("nurseData")) || {};
    for (let [key, value] of Object.entries(storedData)) {
        const input = document.getElementById(key);
        if (input) input.value = value;
    }
    calculateTotalNurses();
    calculateCalendarDays();
    calculateShiftTotals();
}

// 入力フィールドにイベントリスナーを追加
function addEventListeners() {
    const inputs = document.querySelectorAll("input[type='number']");
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            calculateTotalNurses();
            calculateCalendarDays();
            calculateShiftTotals();
            saveData();
        });
    });
}

// DOMの読み込み完了後にイベントリスナーを設定
document.addEventListener("DOMContentLoaded", function() {
    loadData();
    addEventListeners();
});
