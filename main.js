
var matrix = {
    width: 10,
    height: 22,
    size: 32,
    array: [],
};
var shapes = {
    i: {
        color: 'red',
        array:[
            [1,1,1,1],
        ],
    },
    j: {
        color: 'magenta',
        array:[
            [1,1,1], //0 X i=0 / j=1
            [0,0,1],
        ],
    },
    l: {
        color: 'yellow',
        array:[
            [1,1,1], //0 X i=0 / j=1
            [1,0,0],
        ],
    },
    o: {
        color: 'cyan',
        array:[
            [1,1], //0 X i=0 / j=1
            [1,1],
        ],
    },
    s: {
        color: 'blue',
        array:[
            [0,1,1], //0 X i=0 / j=1
            [1,1,0],
        ],
    },
    t: {
        color: 'silver',
        array:[
            [1,1,1], //0 X i=0 / j=1
            [0,1,0],
        ],
    },
    z: {
        color: 'green',
        array:[
            [1,1,0], //0 X i=0 / j=1
            [0,1,1],
        ],
    },
};
var rnd = function(){
    return Object.keys(shapes)[Math.round(Math.random() * 6)];
}

window.onload = function(){
    main(window, document.getElementById('stage'))
};

function init(w, e){
    console.log(w.orientation in [180,0]);
    matrix.size = Math.floor(w.innerHeight / matrix.height);
    e.width  = matrix.size * matrix.width;
    e.height = matrix.size * matrix.height;
    e.style.marginLeft = (w.innerWidth - e.width) / 2;

    console.log("screen", window.innerHeight, window.innerWidth, w.orientation);
    console.log("size", matrix.size);
}

function main(w, e){
    init(w, e);
    w.addEventListener("orientationchange", function(event){
        init(w, e);
        drawMatrix(c, matrix);
        drawShape(c, shape);
    });
    
    var c = e.getContext('2d');
    var shape = JSON.parse(JSON.stringify(shapes[rnd()]));
    
    createMatrix(matrix);
    shape.x = 4;
    shape.y = 0;

    drawMatrix(c, matrix);
    drawShape(c, shape);

    document.addEventListener('keydown', function(e){
        //console.log(e);
        switch (e.which) {
            case 38: // up
                var newShape = rotateCW(shape);
                if (!collision(matrix, newShape, newShape.x, newShape.y)) {
                    shape = newShape;
                }
                //rotateCCW(shape);
            break;
            case 39: // right
                if (!collision(matrix, shape, shape.x+1, shape.y)) {
                    shape.x++;
                }
            break;
            case 37: // left
                if (!collision(matrix, shape, shape.x-1, shape.y)) {
                    shape.x--;
                }
            break;
            case 40: // down
                if (!collision(matrix, shape, shape.x, shape.y+1)) {
                    shape.y++;
                } else {
                    mergeShapeToMatrix(shape, matrix);
                    bustFullRows(matrix);
                    shape = JSON.parse(JSON.stringify(shapes[rnd()]));
                    shape.x = 4;
                    shape.y = 0;
                }
            break;
        } 
        drawMatrix(c, matrix);
        drawShape(c, shape);
    });
}

function bustFullRows(matrix){
    var rows = [];
    for (var i = 0; i < matrix.array.length; i++) {
        var sum = matrix.array[i].reduce(function(a,b){return b?a+1:a;}, 0);
        if (sum == matrix.width) {
            console.log("bust " + i);
            //matrix.array.unshift(matrix.array.slice(i));
            rows.push(i);
        }
    }
    for (var i in rows) {
        matrix.array.splice(rows[i],1)
        matrix.array.unshift(new Array(matrix.width).fill(0));
        for (var i in matrix.array[0]) {
            matrix.array[0][i] = 0;
        }
    }
}

function collision(matrix, shape, x, y) {
    if (x + shape.array[0].length > matrix.width) {
        console.log('a');
        return true;
    } else if (x < 0) {
        console.log('b');
        return true;
    } else if (y + shape.array.length > matrix.height) {
        console.log('c');
        return true;
    }
    for (i = 0; i < shape.array.length; i++) {
        for (j = 0; j < shape.array[i].length; j++) {
            if (shape.array[i][j] && matrix.array[i+y][j+x]) {
                console.log('d');
                return true;
            }
        }
    }
    return false;
}

function mergeShapeToMatrix(shape, matrix){
    for (i=0; i<shape.array.length; i++) {
        for (j=0; j<shape.array[i].length; j++) {
            if (shape.array[i][j]) {
                matrix.array[i+shape.y][j+shape.x] = shape.color;
            }
        }
    }
    //console.log(matrix.array);
}

function createMatrix(matrix){
    var a = [];
    for (var j = 0; j <= matrix.height; j++) {
        a.push([]);
        for (var i = 0; i <= matrix.width; i++) {
            a[j][i] = 0;
        }
    }
    //console.log(a);
    matrix.array = a;
}

function rotateCCW(shape){
    shape = JSON.parse(JSON.stringify(shape));
    var s = shape.array;
    var t = [];
    for (i=0; i<s.length; i++) {
        var _ = s[i].reverse();
        for (j=0; j<_.length; j++) {
            if (typeof t[j] == 'undefined') t[j] = [];
            t[j][i] = _[j];
        }
    }
    //console.log(t);
    shape.array = t;
    return shape;
}
function rotateCW(shape){
    shape = JSON.parse(JSON.stringify(shape));
    var s = shape.array.reverse();
    var t = [];
    for (i=0; i<s.length; i++) {
        for (j=0; j<s[i].length; j++) {
            if (typeof t[j] == 'undefined') t[j] = [];
            t[j][i] = s[i][j];
        }
    }
    //console.log(t);
    shape.array = t;
    return shape;
}

function drawMatrix(c, shape){
    //console.log("shape x: " + shape.x + " y: " + shape.y);
    for (var i = 0; i < shape.array.length; i++) {
        for (var j = 0; j < shape.array[i].length; j++) {
            c.fillStyle = 'white';
            if (shape.array[i][j]) {
                //console.log("i: " + i + " j: " + j + " is: " + shape.array[i][j]);
                c.fillStyle = shape.array[i][j];
            }
            c.fillRect(
                j * matrix.size,
                i * matrix.size, 
                matrix.size,
                matrix.size
            );
        }
    }
}

function drawShape(c, shape, x, y){
    c.fillStyle = shape.color;
//    console.log("shape x: " + shape.x + " y: " + shape.y);
    for (var i = 0; i < shape.array.length; i++) {
        for (var j = 0; j < shape.array[i].length; j++) {
            if (shape.array[i][j]) {
                //console.log("i: " + i + " j: " + j + " is: " + shape.array[i][j]);
                c.fillRect(
                    (j + shape.x) * matrix.size,
                    (i + shape.y) * matrix.size, 
                    matrix.size,
                    matrix.size
                );
            }
        }
    }
}

