let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
//画板控制开关
let painting = false;
//第一个点坐标
let startPoint = {x: undefined, y: undefined};

const clear = document.getElementById("clear");
const result = document.getElementById("result")

//特性检测
if (document.body.ontouchstart !== undefined) {
    //触屏设备
    canvas.ontouchstart = function (e) {
        //[0]表示touch第一个触碰点
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;
        painting = true;
        startPoint = {x: x, y: y};
    };
    canvas.ontouchmove = function (e) {
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;
        let newPoint = {x: x, y: y};
        if (painting) {
            drawLine(startPoint.x, startPoint.y, newPoint.x, newPoint.y);
            startPoint = newPoint;
        }
    };
    canvas.ontouchend = function () {
        painting = false;
    };
}else{// 非触屏设备
    // 按下鼠标(mouse)
    //鼠标点击事件（onmousedown）
    canvas.onmousedown = function (e) {
        let x = e.offsetX;
        let y = e.offsetY;
        painting = true;
        startPoint = {x: x, y: y};
    };

//    滑动鼠标
//    鼠标滑动事件（onmousemove）
    canvas.onmousemove = function (e) {
        let x = e.offsetX;
        let y = e.offsetY;
        let newPoint = {x: x, y: y};
        if (painting) {
            drawLine(startPoint.x, startPoint.y, newPoint.x, newPoint.y);

            startPoint = newPoint;
        }
    };
//    松开鼠标
//    鼠标松开事件（onmouseup)
    canvas.onmouseup = function () {
        painting = false;
        predict();
    };
}


/*****工具函数*****/
//    点与点之间连接
function drawLine(xStart, yStart, xEnd, yEnd) {
    //开始绘制路径
    ctx.beginPath();
    //线宽
    ctx.lineWidth = 2;
    //起始位置
    ctx.moveTo(xStart, yStart);
    //停止位置
    ctx.lineTo(xEnd, yEnd);
    //描绘线路
    ctx.stroke();
    //结束绘制
    ctx.closePath();
}

//清屏
clear.onclick = function() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    result.innerText = "";
};

clear.onclick();

function predict() {
    console.log("Enter");
    let data = ctx.getImageData(0,0,160,160).data;
    let s = '';
    for(let i = 0;i<160*160;i++){
        s += data[ i * 4 ] < 128 ? '1' : '0';
    }
    console.log("s",s.slice(0,100));
    $.ajax({
        url:"/predict",
        data:{
            mat:s
        },
        method:"POST",
        success:res=>{
            console.log(res);
            result.innerText = "Result: " + res.prediction;
        }
    })
}