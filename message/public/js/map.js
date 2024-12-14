// 控制折疊工具列顯示與隱藏
const toggleMenuBtn = document.getElementById("toggleMenuBtn");
const collapsibleMenu = document.getElementById("collapsibleMenu");

toggleMenuBtn.onclick = function() {
    if (collapsibleMenu.style.display === "block") {
        collapsibleMenu.style.display = "none";
    } else {
        collapsibleMenu.style.display = "block";
    }
}

// 地圖彈窗邏輯
const modal = document.getElementById("mapModal");
const showMapBtn = document.getElementById("showMapBtn");
const closeMapBtn = document.getElementById("closeMapBtn");

showMapBtn.onclick = function() {
    modal.style.display = "flex";
}

closeMapBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}