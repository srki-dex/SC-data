"use strict";

/*
    SCREEN COMPARE
    NW.js / Chromium JavaScript
*/


// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getNumber(id) {
    const element = document.getElementById(id);
    return parseFloat(element.value);
}


function setValue(id, value) {
    document.getElementById(id).value = value;
}


function formatNumber(number, decimals = 2) {
    return Number(number).toFixed(decimals);
}


// ============================================================
// CALCULATE PHYSICAL SCREEN SIZE
// ============================================================

function calculateScreen(widthPixels, heightPixels, diagonalInches) {

    const diagonalPixels = Math.sqrt(
        Math.pow(widthPixels, 2) +
        Math.pow(heightPixels, 2)
    );

    const physicalWidth =
        diagonalInches * widthPixels / diagonalPixels;

    const physicalHeight =
        diagonalInches * heightPixels / diagonalPixels;

    const area =
        physicalWidth * physicalHeight;

    const aspectRatio =
        widthPixels / heightPixels;

    return {
        width: physicalWidth,
        height: physicalHeight,
        area: area,
        aspectRatio: aspectRatio
    };
}


// ============================================================
// GET SCREEN DATA
// ============================================================

function getScreenData(screenNumber) {

    const width = getNumber(`width${screenNumber}`);
    const height = getNumber(`height${screenNumber}`);
    const inches = getNumber(`inches${screenNumber}`);

    if (
        !Number.isFinite(width) ||
        !Number.isFinite(height) ||
        !Number.isFinite(inches) ||
        width <= 0 ||
        height <= 0 ||
        inches <= 0
    ) {
        return null;
    }

    return calculateScreen(
        width,
        height,
        inches
    );
}


// ============================================================
// DISPLAY RESULTS
// ============================================================

function displayResults(screen1, screen2) {

    const useCm =
        document.getElementById("useCm").checked;

    const unit = useCm ? "cm" : "in";

    const lengthMultiplier =
        useCm ? 2.54 : 1;

    const areaMultiplier =
        useCm ? 2.54 * 2.54 : 1;


    // SCREEN 1

    setValue(
        "resultWidth1",
        formatNumber(
            screen1.width * lengthMultiplier
        ) + " " + unit
    );

    setValue(
        "resultHeight1",
        formatNumber(
            screen1.height * lengthMultiplier
        ) + " " + unit
    );

    setValue(
        "resultArea1",
        formatNumber(
            screen1.area * areaMultiplier
        ) + " " + unit + "²"
    );


    // SCREEN 2

    setValue(
        "resultWidth2",
        formatNumber(
            screen2.width * lengthMultiplier
        ) + " " + unit
    );

    setValue(
        "resultHeight2",
        formatNumber(
            screen2.height * lengthMultiplier
        ) + " " + unit
    );

    setValue(
        "resultArea2",
        formatNumber(
            screen2.area * areaMultiplier
        ) + " " + unit + "²"
    );
}


// ============================================================
// PERCENTAGE DIFFERENCE
// ============================================================

function percentageDifference(value1, value2) {

    if (value2 === 0) {
        return 0;
    }

    return ((value1 - value2) / value2) * 100;
}


// ============================================================
// DESCRIBE DIFFERENCE
// ============================================================

function describeDifference(value1, value2, name) {

    const difference =
        percentageDifference(value1, value2);

    const amount =
        Math.abs(difference).toFixed(2);


    if (Math.abs(difference) < 0.005) {

        return `
            Screen 1 ${name} is
            <strong class="difference-equal">
                the same as
            </strong>
            Screen 2 ${name}.
        `;
    }


    if (difference > 0) {

        return `
            Screen 1 ${name} is
            <strong class="difference-positive">
                ${amount}% bigger
            </strong>
            than Screen 2 ${name}.
        `;
    }


    return `
        Screen 1 ${name} is
        <strong class="difference-negative">
            ${amount}% smaller
        </strong>
        than Screen 2 ${name}.
    `;
}


// ============================================================
// DISPLAY DIFFERENCES
// ============================================================

function displayDifferences(screen1, screen2) {

    const differenceText =
        document.getElementById("differenceText");


    differenceText.innerHTML = `

        <p>
            ${describeDifference(
                screen1.width,
                screen2.width,
                "width"
            )}
        </p>

        <p>
            ${describeDifference(
                screen1.height,
                screen2.height,
                "height"
            )}
        </p>

        <p>
            ${describeDifference(
                screen1.area,
                screen2.area,
                "area"
            )}
        </p>

    `;
}


// ============================================================
// VISUAL SCREEN OVERLAY
// ============================================================

function drawVisualOverlay() {

    const width1 = getNumber("width1");
    const height1 = getNumber("height1");
    const inches1 = getNumber("inches1");

    const width2 = getNumber("width2");
    const height2 = getNumber("height2");
    const inches2 = getNumber("inches2");


    if (
        !Number.isFinite(width1) ||
        !Number.isFinite(height1) ||
        !Number.isFinite(inches1) ||
        !Number.isFinite(width2) ||
        !Number.isFinite(height2) ||
        !Number.isFinite(inches2)
    ) {
        return;
    }


    const screen1 =
        calculateScreen(
            width1,
            height1,
            inches1
        );


    const screen2 =
        calculateScreen(
            width2,
            height2,
            inches2
        );


    const visualArea =
        document.getElementById("visualArea");

    const visualScreen1 =
        document.getElementById("visualScreen1");

    const visualScreen2 =
        document.getElementById("visualScreen2");


    if (
        !visualArea ||
        !visualScreen1 ||
        !visualScreen2
    ) {
        return;
    }


    const areaWidth =
        visualArea.clientWidth;

    const areaHeight =
        visualArea.clientHeight;


    /*
        Find the largest screen dimensions.
    */

    const maxWidth =
        Math.max(
            screen1.width,
            screen2.width
        );

    const maxHeight =
        Math.max(
            screen1.height,
            screen2.height
        );


    /*
        Keep some margin around the screens.
    */

    const scaleX =
        (areaWidth * 0.85) / maxWidth;

    const scaleY =
        (areaHeight * 0.85) / maxHeight;


    const scale =
        Math.min(
            scaleX,
            scaleY
        );


    const screen1Width =
        screen1.width * scale;

    const screen1Height =
        screen1.height * scale;


    const screen2Width =
        screen2.width * scale;

    const screen2Height =
        screen2.height * scale;


    /*
        Apply dimensions.
    */

    visualScreen1.style.width =
        `${screen1Width}px`;

    visualScreen1.style.height =
        `${screen1Height}px`;


    visualScreen2.style.width =
        `${screen2Width}px`;

    visualScreen2.style.height =
        `${screen2Height}px`;


    /*
        Center both screens.
    */

    visualScreen1.style.left =
        `${(areaWidth - screen1Width) / 2}px`;

    visualScreen1.style.top =
        `${(areaHeight - screen1Height) / 2}px`;


    visualScreen2.style.left =
        `${(areaWidth - screen2Width) / 2}px`;

    visualScreen2.style.top =
        `${(areaHeight - screen2Height) / 2}px`;
}


// ============================================================
// COMPARE SCREENS
// ============================================================

function compareScreens() {

    const screen1 =
        getScreenData(1);

    const screen2 =
        getScreenData(2);


    /*
        Validate input.
    */

    if (!screen1 || !screen2) {

        alert(
            "Please enter valid width, height and diagonal size for both screens."
        );

        return;
    }


    /*
        Display calculated results.
    */

    displayResults(
        screen1,
        screen2
    );


    /*
        Display percentage differences.
    */

    displayDifferences(
        screen1,
        screen2
    );


    /*
        Draw physical-size overlay.
    */

    drawVisualOverlay();
}


// ============================================================
// UNIT SWITCH
// ============================================================

function updateUnits() {

    const screen1 =
        getScreenData(1);

    const screen2 =
        getScreenData(2);


    if (screen1 && screen2) {

        displayResults(
            screen1,
            screen2
        );
    }
}


document
    .getElementById("useInches")
    .addEventListener(
        "change",
        updateUnits
    );


document
    .getElementById("useCm")
    .addEventListener(
        "change",
        updateUnits
    );


// ============================================================
// COMPARE BUTTON
// ============================================================

document
    .getElementById("compareBtn")
    .addEventListener(
        "click",
        compareScreens
    );


// ============================================================
// SCREEN INFORMATION
// ============================================================

document
    .getElementById("screenInfoBtn")
    .addEventListener(
        "click",
        showScreenInfo
    );


function showScreenInfo() {

    const screenInfo = window.screen;

    const width = screenInfo.width;
    const height = screenInfo.height;

    const availableWidth = screenInfo.availWidth;
    const availableHeight = screenInfo.availHeight;

    const pixelRatio = window.devicePixelRatio;

    const colorDepth = screenInfo.colorDepth;
    const pixelDepth = screenInfo.pixelDepth;

    const orientation = screenInfo.orientation
        ? screenInfo.orientation.type
        : "Unknown";

    const angle = screenInfo.orientation
        ? screenInfo.orientation.angle
        : 0;

    const estimatedCssWidth =
        width / pixelRatio;

    const estimatedCssHeight =
        height / pixelRatio;


    const message =

        "Resolution: " +
        `${width} × ${height} px\n\n` +

        "Available desktop: " +
        `${availableWidth} × ${availableHeight} px\n\n` +

        "Device pixel ratio: " +
        `${pixelRatio}\n\n` +

        "Estimated CSS resolution: " +
        `${formatNumber(estimatedCssWidth, 0)} × ` +
        `${formatNumber(estimatedCssHeight, 0)} px\n\n` +

        "Orientation: " +
        `${orientation}\n\n` +

        "Orientation angle: " +
        `${angle}°\n\n` +

        "Color depth: " +
        `${colorDepth}-bit\n\n` +

        "Pixel depth: " +
        `${pixelDepth}-bit`;


    document.getElementById("screenInfoText").textContent =
        message;


    const modalElement =
        document.getElementById("screenInfoModal");


    const modal =
        new bootstrap.Modal(modalElement);

    modal.show();
}

// ============================================================
// AUTOMATIC RESIZE
// ============================================================

window.addEventListener(
    "resize",
    function () {

        /*
            Redraw the visual overlay when
            the application window changes size.
        */

        drawVisualOverlay();
    }
);


// ============================================================
// ENTER KEY SUPPORT
// ============================================================

const inputFields = document.querySelectorAll(
    "#width1, #height1, #inches1, " +
    "#width2, #height2, #inches2"
);


inputFields.forEach(function (input) {

    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                compareScreens();
            }
        }
    );

});


// ============================================================
// INITIAL STATE
// ============================================================

window.addEventListener(
    "load",
    function () {

        /*
            Try to draw the overlay initially.
        */

        drawVisualOverlay();

    }
);


const externalLinks = document.querySelectorAll('[data-external-link]');

externalLinks.forEach(link => {
  link.addEventListener('click', (evt) => {
    evt.preventDefault();
    nw.Shell.openExternal(evt.currentTarget.href);
  });
});