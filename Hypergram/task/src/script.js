let fileInput = document.querySelector("#file-input");

let canvas;
let ctx;
let imageData;
let initPixels;

const brightnessSlider = document.querySelector("#brightness");
const contrastSlider = document.querySelector("#contrast");
const transparentSlider = document.querySelector("#transparent");

let brightnessValue = Number(brightnessSlider.value);
let contrastValue = Number(contrastSlider.value);
let transparentValue = Number(transparentSlider.value);

fileInput.addEventListener("change", function (ev) {
  if (ev.target.files) {
    let file = ev.target.files[0];
    let reader  = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function (e) {
      let image = new Image();
      image.src = e.target.result;
      image.onload = function () {
        canvas = document.querySelector("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        initPixels = imageData.data;
        resetSliders();
      }
    }
  }
});

function resetSliders() {
  brightnessSlider.value = 0;
  contrastSlider.value = 0;
  transparentSlider.value = 1;
}

let Truncate = function (num) {
  if (num < 0) {
    return 0;
  }
  else if (num > 255) {
    return 255;
  }
  else {
    return num;
  }
}

brightnessSlider.addEventListener("change", function () {
  brightnessValue = Number(brightnessSlider.value);
  drawImage();
})

contrastSlider.addEventListener("change", function () {
  contrastValue = Number(contrastSlider.value);
  drawImage();
})

transparentSlider.addEventListener("change", function () {
  transparentValue = Number(transparentSlider.value);
  drawImage();
})

function drawImage() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  let factor = 259 * (255 + contrastValue) / (255 * (259 - contrastValue));

  for (let i = 0; i < canvas.width * canvas.height; i++) {
    const RED = factor * (initPixels[4 * i] - 128.0) + 128.0;
    const GREEN = factor * (initPixels[4 * i + 1] - 128) + 128;
    const BLUE = factor * (initPixels[4 * i + 2] - 128) + 128;
    pixels[4 * i] = Truncate(RED + brightnessValue);
    pixels[4 * i + 1] = Truncate(GREEN + brightnessValue);
    pixels[4 * i + 2] = Truncate(BLUE + brightnessValue);
    pixels[4 * i + 3] = initPixels[4 * i + 3] * transparentValue;
  }

  ctx.putImageData(imageData, 0, 0);
}

function downloadCanvas() {
  const image = canvas.toDataURL();

  // create temporary link
  const tmpLink = document.createElement('a');
  tmpLink.download = 'result.png';
  tmpLink.href = image;

  document.body.appendChild(tmpLink);
  tmpLink.click();
  document.body.removeChild(tmpLink);
}