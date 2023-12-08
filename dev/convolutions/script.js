// Create 40x40 grid
const mainGrid = document.getElementById("mainGrid");

for (let i = 0; i < 1600; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.addEventListener("click", function() {
    cell.classList.toggle("on");
  });
  mainGrid.appendChild(cell);
}
// Existing code to create main grid
// ...

// Create output 40x40 grid
const outputGrid = document.getElementById("outputGrid");

for (let i = 0; i < 1600; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  outputGrid.appendChild(cell);
}

// Existing code for grid creation...

// Apply convolution when button is clicked
document.getElementById("applyConvolution").addEventListener("click", function() {
    const mainCells = Array.from(mainGrid.getElementsByClassName("cell"));
    const outputCells = Array.from(outputGrid.getElementsByClassName("cell"));
    
    const kernel = [
      1, 4, 6, 4, 1,
      4, 16, 24, 16, 4,
      6, 24, 36, 24, 6,
      4, 16, 24, 16, 4,
      1, 4, 6, 4, 1
    ];
  
    let minVal = Number.POSITIVE_INFINITY;
    let maxVal = Number.NEGATIVE_INFINITY;
    let convResults = [];
  
    // Compute convolution and find min and max values
    for (let y = 2; y < 38; y++) {
      for (let x = 2; x < 38; x++) {
        let sum = 0;
        for (let ky = -2; ky <= 2; ky++) {
          for (let kx = -2; kx <= 2; kx++) {
            const idx = (y + ky) * 40 + (x + kx);
            const kidx = (ky + 2) * 5 + (kx + 2);
            sum += mainCells[idx].classList.contains("on") ? kernel[kidx] : 0;
          }
        }
        convResults.push(sum);
        minVal = Math.min(minVal, sum);
        maxVal = Math.max(maxVal, sum);
      }
    }
  
    // Normalize and set the background color of the output cells
    for (let y = 2; y < 38; y++) {
      for (let x = 2; x < 38; x++) {
        const outIdx = y * 40 + x;
        const convIdx = (y - 2) * 36 + (x - 2); // Adjust index for 38x38 processed area
        const convVal = convResults[convIdx];
        const normalizedVal = (convVal - minVal) / (maxVal - minVal);
        const grayScale = Math.floor(normalizedVal * 255);
        outputCells[outIdx].style.backgroundColor = `rgb(${grayScale}, ${grayScale}, ${grayScale})`;
      }
    }
  });
  