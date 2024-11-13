// 各月の看護師総数を計算する関数
function calculateTotalNurses() {
    const months = [
        "apr", "may", "jun", "jul", "aug", "sep",
        "oct", "nov", "dec", "jan", "feb", "mar"
    ];

    months.forEach(month => {
        // 各月の予定看護師総数、中途退職者数、産休予定者数を取得
        const nurseCount = parseInt(document.getElementById(`nurse-count-${month}`).value) || 0;
        const retireCount = parseInt(document.getElementById(`retire-count-${month}`).value) || 0;
        const maternityCount = parseInt(document.getElementById(`maternity-count-${month}`).value) || 0;
        
        // 看護師総数の計算 (予定看護師総数 - 中途退職者数 - 産休予定者数)
        const totalNurse = nurseCount - retireCount - maternityCount;
        
        // 結果を総数のセルに表示
        document.getElementById(`total-nurse-${month}`).value = totalNurse;
    });

    alert("看護師総数が計算されました。");
}

// ページロード時にローカルストレージからデータを読み込む関数
function loadData() {
    const storedData = JSON.parse(localStorage.getItem("nurseCounts")) || {};
    for (let [key, value] of Object.entries(storedData)) {
        const input = document.getElementById(key);
        if (input) input.value = value;
    }
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
    alert("データが保存されました。");
}

// DOMの読み込み完了後にイベントリスナーを設定
document.addEventListener("DOMContentLoaded", function() {
    loadData();

    const saveButton = document.getElementById("save-button");
    if (saveButton) {
        saveButton.addEventListener("click", saveData);
    }
});
