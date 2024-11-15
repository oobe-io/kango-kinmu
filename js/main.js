// JavaScriptファイル全文

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
        // 予定看護師総数が0の場合、看護師総数は空欄とする
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

// 月ごとの平日・休日の総和を計算する関数
function calculateMonthlySums() {
    const months = [
        "apr", "may", "jun", "jul", "aug", "sep",
        "oct", "nov", "dec", "jan", "feb", "mar"
    ];

    months.forEach(month => {
        const shiftTypes = ["night", "off-duty", "short", "late", "managerial", "day"];
        let weekdayTotal = 0;
        let holidayTotal = 0;

        // 平日と休日の合計を計算
        shiftTypes.forEach(type => {
            const weekdayShift = parseInt(document.getElementById(`${type}-shift-${month}-weekday`).value) || 0;
            const holidayShift = parseInt(document.getElementById(`${type}-shift-${month}-holiday`).value) || 0;

            weekdayTotal += weekdayShift;
            holidayTotal += holidayShift;
        });

        // 総和の欄に計算結果を表示
        document.getElementById(`total-${month}-weekday`).value = weekdayTotal;
        document.getElementById(`total-${month}-holiday`).value = holidayTotal;
    });
}

// ページロード時にローカルストレージからデータを読み込む関数
function loadData() {
    const storedData = JSON.parse(localStorage.getItem("nurseCounts")) || {};
    for (let [key, value] of Object.entries(storedData)) {
        const input = document.getElementById(key);
        if (input) input.value = value;
    }
    calculateTotalNurses(); // 初回ロード時にも計算を実行
    calculateCalendarDays(); // 暦日計算も実行
    calculateMonthlySums(); // 月ごとの総和も計算
}

// フォームのデータをローカルストレージに保存する関数
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

// 入力フィールドにイベントリスナーを追加
function addEventListeners() {
    const inputs = document.querySelectorAll("input[type='number']");
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            calculateTotalNurses(); // 入力変更時に自動計算
            calculateCalendarDays(); // 暦日計算も自動で更新
            calculateMonthlySums(); // 平日・休日の総和を更新
            saveData();             // データを自動保存
        });
    });
}

// テーブル切り替え機能を追加
function addTableSwitcher() {
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");
    const tablePeriod = document.getElementById("table-period");
    const table4To9 = document.getElementById("table-4-9");
    const table10To3 = document.getElementById("table-10-3");

    // 初期設定
    let currentTable = "4-9";
    table4To9.classList.add("active");

    // 切り替え関数
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

    // イベントリスナーを設定
    prevButton.addEventListener("click", toggleTables);
    nextButton.addEventListener("click", toggleTables);
}

// DOMの読み込み完了後にイベントリスナーを設定
document.addEventListener("DOMContentLoaded", function () {
    loadData();
    addEventListeners();
    addTableSwitcher(); // テーブル切り替え機能を初期化
});
