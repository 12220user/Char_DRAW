let img = undefined;
let canvas
let ctx
let size = { x: 512, y: 512 }
let matrix


$(document).ready(() => {
    canvas = document.getElementById("frame_draw")
    ctx = canvas.getContext("2d")
    $('#file_src').change((evt) => {
        var tgt = evt.target || window.event.srcElement,
            files = tgt.files;

        // FileReader support
        if (FileReader && files && files.length) {

            var fr = new FileReader();
            fr.onload = function() {
                document.getElementById("imgSource").src = fr.result;
                img = document.getElementById("imgSource")
                    //console.log(fr.result)
                    // wait draw img
                img.onload = () => {
                    drawCanvasImage()
                }
            }
            fr.readAsDataURL(files[0]);
        }
    })
    charwordass = cpp.split(' ').filter(x => x).filter(x => 'undefined')

    $('#text-result').hide()
})




function drawCanvasImage() {
    if (!img) return
    resize()
    ctx.drawImage(img, 0, 0, size.x, size.y)
        //ctx.fillStyle = "rgb(255 0 0)";
        //ctx.fillRect(0, 0, 500, 500)
}


function resize() {
    //size.x = $('#x-Size').val()
    //size.y = $('#y-Size').val()
    size = { x: $('#imgSource').width(), y: $('#imgSource').height() }
    let f = $('#frame')
    let fr = $('#frame_draw')
    let frwithmax = f.width() > f.height()
    let imgwsizemax = size.x > size.y

    if (frwithmax) {
        fr.width(imgwsizemax ? '100%' : 'auto')
        fr.height(imgwsizemax ? 'auto' : '100%')
    } else {
        fr.width(imgwsizemax ? '100%' : 'auto')
        fr.height(imgwsizemax ? 'auto' : '100%')
    }

    console.log(frwithmax, imgwsizemax)

    fr.attr('width', size.x)
    fr.attr('height', size.y)
}

function pixelate() {
    matrix = []
    let vl = document.getElementById('pixi')
    for (let y = 0; y < size.y / vl.value; y++) {
        let line = []
        for (let x = 0; x < size.x / vl.value; x++) {
            var cl = middleColor({ x: x * vl.value, y: y * vl.value }, vl.value)
                //console.log(cl)
            ctx.fillStyle = `rgb(${cl[0]} ${cl[1]} ${cl[2]})`
                //console.log(`rgb(${cl[0]},${cl[1]},${cl[2]})`)
            ctx.fillRect(x * vl.value, y * vl.value, vl.value, vl.value)
            line.push(cl)
        }
        matrix.push(line)
    }
}

function middleColor(start, size) {
    var data = ctx.getImageData(start.x, start.y, size, size).data;
    let middle = [0, 0, 0, 0]
    let count = (size * size) / 4
    for (let i = 0; i < data.length / 4; i += 4) {
        middle[0] += data[i]
        middle[1] += data[i + 1]
        middle[2] += data[i + 2]
        middle[3] += data[i + 3]
            //console.log(data[i] + "  " + data[1] + "  " + data[2])
    }
    //console.log(count)
    middle = [middle[0] / count, middle[1] / count, middle[2] / count, middle[3] / count]

    return middle
}


let isop = false

function generate(btn) {
    if (matrix == []) { alert('Изображение еще не пикселизованно. (для хорошего результата нужна степень минимум 16 пикселей)'); return; }
    isop = !isop
    btn.innerHTML = isop ? "Назад" : 'Генерировать'
    if (isop) {
        $('#frame_draw').hide()
        $('#text-result').show()
        let frame = $('#text-result')
        frame.html('')
            //console.log(imageCharDraw(matrix))
        let data = imageCharDraw(matrix)
        frame.html('')

        frame.html(data)
        res($('#pixel_box_font_size_slider').val())
        ressf($('#pixel_char_font_size_slider').val())
            //open_in_new_page('', data)
    } else {
        $('#frame_draw').show()
        $('#text-result').hide()
    }
}

let charsGradient = `   .'"^:;<>123acbNMBH@#`
let charwordass = [

]
let type_chargen = 'rainbow'

function imageCharDraw(m) {

    //pixelLine = '01'

    function colorize(char, rgb) {
        //return char
        return `<div class="char" style='color: rgb( ${rgb })'><span>${char}</span></div>`
    }

    function lineGen(line) {
        var data = ''
        line.forEach(e => {
                let bli = Math.ceil((((e[0] + e[1] + e[2]) / 3) / 255) * (charsGradient.length - 1))
                data += colorize(chargen(type_chargen, bli), `${e[0]} ${e[1]} ${e[2]}`)
            })
            //return `${data}`
        return `<div class="line" style="display:flex;">${data}</div>`
    }
    let resp = ``
    m.forEach(e => {
        resp += lineGen(e)
    })
    return resp
}
let curword = ''
let windex = -1

function chargen(type = 'rainbow', val = 0) {
    if (type == 'rainbow') {
        return charsGradient[val]
    } else if (type == 'word') {
        if (windex >= curword.length - 1) {
            windex = -1
            curword = charwordass[Math.floor(Math.random() * charwordass.length)]
            curword += ' '
        }
        windex += 1
        return curword[windex]
    }
}

function res(slider) {
    if (isop) {
        $('.char').css('width', slider)
        $('.char').css('height', slider)
    }
}

function ressf(slider) {
    $('.char').css('font-size', slider + "px")
    if (isop) {
        //console.log(slider)
    }
}


function open_in_new_page(name, data) {
    const winHtml = `<!DOCTYPE html>
    <html>
        <head>
            <title>${name}</title>
        </head>
        <body>
            ${data}
        </body>
    </html>`;

    const winUrl = URL.createObjectURL(
        new Blob([winHtml], { type: "text/html" })
    );

    const win = window.open(
        winUrl,
        "win",
        `width=800,height=400,screenX=200,screenY=200`
    );
}

function change_bg(val) {
    $('#frame').css('background', val);
}

function open_in_new_page() {
    if (matrix) {
        let data = imageCharDraw(matrix)

        var win = window.open("", "Result", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=200,top=" + (screen.height - 400) + ",left=" + (screen.width - 840));
        win.document.body.innerHTML = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Result</title>
    <style>
        *{
    margin:0;
    padding:0;    
    }
    body{
    padding-top:20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: ${$('#bg_color').val()};
    }
    .char{
        font-size: ${$('#pixel_char_font_size_slider').val()}px;
        width:${$('#pixel_box_font_size_slider').val()};
        height:${$('#pixel_box_font_size_slider').val()};
    }
        .line {
    font-size: 16px;
    margin: 0;
    padding: 0;
}

.line div {
    height: 20px;
    width: 20px;
    transition: 300ms;
    z-index: 10;
}

.line div:hover {
    scale: 2;
}
    </style>
</head>
<body>
    ${data}
</body>
</html>
        `;
    }
}