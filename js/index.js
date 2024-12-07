// 获取画布
const canvas = document.getElementById('canvas');
// 创建绘制环境
const ctx = canvas.getContext('2d');
// 画布宽高
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 背景颜色
canvas.style.backgroundColor = 'black';
const fontsize = 16;
ctx.fillStyle = 'green';
ctx.font = `${fontsize}px Arial`;

const texts = 'Wake up, Neo...: The Matrix has you... :Follow the white rabbit.:Knock';
const textArry = texts.split(':');
const charArray = Array(Math.floor(canvas.width / (fontsize * 0.1))).fill(0);

function r(min, max) { // [100, 200)
    return ~~(Math.random() * (max - min + 1) + min);
}

function pick() {
    return arguments[r(0, arguments.length - 1)];
}

function getChar() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    return chars[Math.floor(Math.random() * chars.length)];
}

function digitalRain() {
    setInterval(() => {
        canvas.style.background = 'rgba(0,0,0,0.1)';
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        charArray.map((v, i) => {
            ctx.fillStyle = `hsl(136,100%,${r(50, 78)}%)`;
            ctx.fillText(getChar(), i * (fontsize * 0.1), v);
            charArray[i] = Math.random() < 0.01 ? 0 : v + fontsize;
        });
    }, 50);
}
digitalRain();


