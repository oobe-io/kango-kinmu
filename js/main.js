// 看護師総数を計算する関数
function calculateTotalNurses() {
    const months = [
        "apr", "may", "jun", "jul", "aug", "sep",
        "oct", "nov", "dec", "jan", "feb", "mar"
    ];

    // 累積の「計」を保持する変数
    let cumulativeTotal = 0;

    months.forEach(month => {
        // 各月の予定看護師総数、中途退職者数、産休予定者数を取得
        const nurseCount = parseInt(document.getElementById(`nurse-count-${month}`).value) || 0;
        const retireCount = parseInt(document.getElementById(`retire-count-${month}`).value) || 0;
        const maternityCount = parseInt(document.getElementById(`maternity-count-${month}`).value) || 0;

        // 「計」を算出（中途退職者数 + 産休予定者数）
        const totalCount = retireCount + maternityCount;
        document.getElementById(`total-count-${month}`).value = totalCount;

        // 累積の「計」に今月の「計」を加算
        cumulativeTotal += totalCount;

        // 看護師総数の計算
        if (nurseCount === 0) {
            document.getElementById(`total-nurse-${month}`).value = "";
        } else {
            const totalNurse = nurseCount - cumulativeTotal;
            document.getElementById(`total-nurse-${month}`).value = totalNurse;
        }
    });
}

// 月ごとの暦日を計算する関数
function calculateCalendarDays() {
    const months = [
        "apr", "may", "jun", "jul", "aug", "sep",
        "oct", "nov", "dec", "jan", "feb", "mar"
    ];

    months.forEach(month => {
        const weekday = parseInt(document.getElementById(`weekday-${month}`).value) || 0;
        const holiday = parseInt(document.getElementById(`holiday-${month}`).value) || 0;

        // 暦日を計算（平日 + 休日）
        const calendarDays = weekday + holiday;
        document.getElementById(`calendar-${month}`).value = calendarDays;
    });
}

// シフト入力の総和を計算して表示する関数
function calculateShiftTotals() {
    const months = [
        "apr", "may", "jun", "jul", "aug", "sep",
        "oct", "nov", "dec", "jan", "feb", "mar"
    ];

    const shiftTypes = ["night", "off-duty", "short", "late", "managerial", "day"];
    
    // 月ごとの総和を計算
    months.forEach(month => {
        let weekdayTotal = 0;
        let holidayTotal = 0;

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
    const nurseCounts = {};

    months.forEach(month => {
        nurseCounts[`nurse-count-${month}`] = document.getElementById(`nurse-count-${month}`).value || 0;
        nurseCounts[`retire-count-${month}`] = document.getElementById(`retire-count-${month}`).value || 0;
        nurseCounts[`maternity-count-${month}`] = document.getElementById(`maternity-count-${month}`).value || 0;
        nurseCounts[`weekday-${month}`] = document.getElementById(`weekday-${month}`).value || 0;
        nurseCounts[`holiday-${month}`] = document.getElementById(`holiday-${month}`).value || 0;
    });

    localStorage.setItem("nurseCounts", JSON.stringify(nurseCounts));
}

// ローカルストレージからデータを読み込む関数
function loadData() {
    const storedData = JSON.parse(localStorage.getItem("nurseCounts")) || {};
    for (let [key, value] of Object.entries(storedData)) {
        const input = document.getElementById(key);
        if (input) input.value = value;
    }
    calculateTotalNurses(); // 初回ロード時にも計算を実行
    calculateCalendarDays(); // 暦日計算も実行
    calculateShiftTotals(); // シフト総和計算も実行
}

// 入力フィールドにイベントリスナーを追加
function addEventListeners() {
    const inputs = document.querySelectorAll("input[type='number']");
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            calculateTotalNurses(); // 看護師総数の自動計算
            calculateCalendarDays(); // 暦日計算の自動更新
            calculateShiftTotals(); // シフト総和の自動計算
            saveData(); // データを自動保存
        });
    });
}

// DOMの読み込み完了後にイベントリスナーを設定
document.addEventListener("DOMContentLoaded", function() {
    loadData(); // 初回ロード時にデータを復元
    addEventListeners(); // イベントリスナーを追加
});
