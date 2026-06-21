/* ------------------------
   ファイル名一覧・ルール
------------------------ */

const SHAPE_DATA =
{
    shimaenaga:
    {
        name:"シマエナガ型",
        size:68
    },

    heart:
    {
        name:"ハート型",
        size:60
    },

    circle:
    {
        name:"丸型",
        size:57
    }
};

const COLOR_DATA =
{
    white:"しろいろ",
    pink:"ももいろ",
    lightblue:"みずいろ",
    purple:"むらさきいろ"
};


let selectedPill = null;

let logoVisible = true;

/* ------------------------
   錠剤追加
------------------------ */

function addPillImage(
    imagePath,
    size,
    typeName,
    colorName
)
{
    const img = document.createElement("img");

    img.src = imagePath;

    img.classList.add("pill");

    img.style.width = size + "px";

    img.style.left = "150px";
    img.style.top = "250px";

    img.dataset.rotation = 0;
    img.dataset.typeName = typeName;
    img.dataset.colorName = colorName;

    img.addEventListener("click", function(event)
    {
        selectPill(img);

        event.stopPropagation();
    });

    document
        .getElementById("pills")
        .appendChild(img);

    setupDrag(img);
}

/* ------------------------
   錠剤選択
------------------------ */

function selectPill(pill)
{
    if(selectedPill)
    {
        selectedPill.classList.remove("selected");
    }

    selectedPill = pill;

    selectedPill.classList.add("selected");

    document
        .getElementById("selectedInfo")
        .textContent =
            "選択中：[" +
            pill.dataset.typeName +
            "] " +
            pill.dataset.colorName;

}



/* ------------------------
   回転
------------------------ */

function rotateSelected(amount)
{
    if(!selectedPill)
    {
        return;
    }

    let angle =
        parseInt(selectedPill.dataset.rotation) || 0;

    angle += amount;

    selectedPill.dataset.rotation = angle;

    updateTransform(selectedPill);
}

function updateTransform(target)
{
    const x =
        parseFloat(target.getAttribute("data-x")) || 0;

    const y =
        parseFloat(target.getAttribute("data-y")) || 0;

    const angle =
        parseInt(target.dataset.rotation) || 0;

    target.style.transform =
        `translate(${x}px, ${y}px) rotate(${angle}deg)`;
}

/* ------------------------
   削除
------------------------ */

function deleteSelected()
{
    if(!selectedPill)
    {
        return;
    }

    selectedPill.remove();

    selectedPill = null;
    document
    .getElementById("selectedInfo")
    .textContent =
        "選択中：なし";
}

function clearAllPills()
{
    document.getElementById("pills").innerHTML = "";

    selectedPill = null;
    document
    .getElementById("selectedInfo")
    .textContent =
        "選択中：なし";
}

/* ------------------------
   ロゴ
------------------------ */

function toggleLogo()
{
    const logo =
        document.getElementById("logo");

    logoVisible = !logoVisible;

    logo.style.display =
        logoVisible ? "block" : "none";
}

/* ------------------------
   ドラッグ
------------------------ */

function setupDrag(target)
{
    interact(target).draggable(
    {
        listeners:
        {
            move(event)
            {
                const target = event.target;

                let x =
                    parseFloat(target.getAttribute("data-x")) || 0;

                let y =
                    parseFloat(target.getAttribute("data-y")) || 0;

                x += event.dx;
                y += event.dy;

                target.setAttribute("data-x", x);
                target.setAttribute("data-y", y);

                updateTransform(target);
            }
        }
    });
}

/* ------------------------
   選択解除
------------------------ */

document.addEventListener("click", function(event)
{
    if(event.target.classList.contains("pill"))
    {
        return;
    }

    if(event.target.tagName === "BUTTON")
    {
        return;
    }

    if(event.target.tagName === "INPUT")
    {
        return;
    }

    if(event.target.classList.contains("pillButton"))
    {
        return;
    }

    if(selectedPill)
    {
        selectedPill.classList.remove("selected");

        selectedPill = null;
        document
        .getElementById("selectedInfo")
        .textContent =
        "選択中：なし";
    }
});

/* ------------------------
   保存
------------------------ */

async function saveImage()
{
    const area =
        document.getElementById("areaBackground");

    const canvas =
    await html2canvas(area,
    {
        useCORS: true,
        backgroundColor: null,

        scale: 3
    });

    const link =
        document.createElement("a");

    link.download =
        "shimaenaga_image.png";

    link.href =
        canvas.toDataURL("image/png");

    link.click();
}

/* ------------------------
   背景色パネル
------------------------ */

function openBackgroundPanel()
{
    document
        .getElementById("backgroundPanel")
        .classList.remove("panelHidden");
}

function closeBackgroundPanel()
{
    document
        .getElementById("backgroundPanel")
        .classList.add("panelHidden");
}

function setBackground(color)
{
    document
        .getElementById("areaBackground")
        .style.backgroundColor = color;
}

function setCustomBackground()
{
    const color =
        document.getElementById("customColor").value;

    setBackground(color);
}

/* ------------------------
   錠剤パネル
------------------------ */

function openPillPanel()
{
    document
        .getElementById("pillPanel")
        .classList.remove("panelHidden");

    showTab("shimaenaga");
}

function closePillPanel()
{
    document
        .getElementById("pillPanel")
        .classList.add("panelHidden");
}

function showTab(tabName)
{
    document
        .querySelectorAll(".pillTabContent")
        .forEach(tab =>
        {
            tab.style.display = "none";
        });

    document
        .querySelectorAll(".pillTab")
        .forEach(tab =>
        {
            tab.classList.remove("activeTab");
        });

    document
        .getElementById("tab-" + tabName)
        .style.display = "grid";

    if(tabName === "shimaenaga")
    {
        document
            .getElementById("tabButtonShimaenaga")
            .classList.add("activeTab");
    }

    if(tabName === "circle")
    {
        document
            .getElementById("tabButtonCircle")
            .classList.add("activeTab");
    }

    if(tabName === "heart")
    {
        document
            .getElementById("tabButtonHeart")
            .classList.add("activeTab");
    }
}

function createPillButtons()
{
    Object.keys(SHAPE_DATA).forEach(shape =>
    {
        Object.keys(COLOR_DATA).forEach(color =>
        {
            const imagePath =
                "img/pill_" +
                shape +
                "_" +
                color +
                ".png";

            const image =
                new Image();

            image.onload = function()
            {
                const button =
                    document.createElement("img");

                button.src =
                    imagePath;

                button.classList.add("pillButton");

                button.onclick = function()
                {
                    addPillImage(
                        imagePath,
                        SHAPE_DATA[shape].size,
                        SHAPE_DATA[shape].name,
                        COLOR_DATA[color]
                    );
                };

                const label =
                    document.createElement("div");

                label.classList.add("pillLabel");

                label.textContent =
                    COLOR_DATA[color];

                const item =
                    document.createElement("div");

                item.classList.add("pillItem");

                item.appendChild(button);

                item.appendChild(label);

                const tab =
                    document.getElementById(
                        "tab-" + shape
                    );

                tab.classList.add("pillGrid");

                tab.appendChild(item);
            };

            image.onerror = function()
            {
                /* 画像が無ければ何もしない */
            };

            image.src = imagePath;
        });
    });
}

createPillButtons();

/* ------------------------
   X投稿文
------------------------ */

function postToX()
{
    const text =
        "シマエナガのおくすりを作りました！\n\n" +
        "販売ページはこちら\n" +
        "https://minne.com/items/35941748\n" +
        "#シマエナガのおくすりシミュレーター";

    const url =
        "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent(text);

    window.open(url, "_blank");
}

/* ------------------------
   ランダム配置
------------------------ */

function randomizePills()
{
    const pills =
        document.querySelectorAll(".pill");

    pills.forEach(pill =>
    {
        const x =
            Math.random() * 140 - 70;

        const y =
            Math.random() * 180 - 90;

        const angle =
            Math.floor(
                Math.random() * 360
            );

        pill.setAttribute("data-x", x);
        pill.setAttribute("data-y", y);

        pill.dataset.rotation =
            angle;

        updateTransform(pill);
    });
}