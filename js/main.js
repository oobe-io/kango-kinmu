// 各月の看護師総数を計算する関数
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

        // 看護師総数の計算 (予定看護師総数 - 累積の「計」)
        const totalNurse = nurseCount - cumulativeTotal;
        document.getElementById(`total-nurse-${month}`).value = totalNurse;
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
    });

    localStorage.setItem("nurseCounts", JSON.stringify(nurseCounts));
}

// 入力フィールドにイベントリスナーを追加
function addEventListeners() {
    const inputs = document.querySelectorAll("input[type='number']");
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            calculateTotalNurses(); // 入力変更時に自動計算
            saveData();             // データを自動保存
        });
    });
}

// DOMの読み込み完了後にイベントリスナーを設定
document.addEventListener("DOMContentLoaded", function() {
    loadData();
    addEventListeners();
});
