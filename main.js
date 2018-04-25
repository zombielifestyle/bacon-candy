
var matrix = {
    w: 10,
    h: 22,
    array: [],
},
shapes = {
    i: {
        c: 'red',
        array:[
            [1,1,1,1],
        ],
    },
    j: {
        c: 'magenta',
        array:[
            [1,1,1], //0 X i=0 / j=1
            [0,0,1],
        ],
    },
    l: {
        c: 'yellow',
        array:[
            [1,1,1], //0 X i=0 / j=1
            [1,0,0],
        ],
    },
    o: {
        c: 'cyan',
        array:[
            [1,1], //0 X i=0 / j=1
            [1,1],
        ],
    },
    s: {
        c: 'blue',
        array:[
            [0,1,1], //0 X i=0 / j=1
            [1,1,0],
        ],
    },
    t: {
        c: 'silver',
        array:[
            [1,1,1], //0 X i=0 / j=1
            [0,1,0],
        ],
    },
    z: {
        c: 'green',
        array:[
            [1,1,0], //0 X i=0 / j=1
            [0,1,1],
        ],
    },
},
update = true,
size = 32,
w = window,
d = document,
m = Math,
j = JSON;
w.onload = function(){
    (function(w, d, e, rand, round, floor, ael, jp, js){

        function collision(matrix, shape, x, y) {
            if (
                (x + shape.array[0].length > matrix.w) ||
                (x < 0) ||
                (y + shape.array.length > matrix.h)
            ) return 1;
            return walk(shape, function(s, _x, _y){
                return (s.array[_y][_x] && matrix.array[_y+y][_x+x]);
            });
        }

        function walk(m, f){
            var h = m.h || m.array.length - 1,
                w = m.w || m.array[0].length - 1,
                my, mx;

            //console.log(h,w);
            for (my = 0; my <= h; my++) {
                for (mx = 0; mx <= w; mx++) {
                    if (f(m, mx, my)) return 1;
                }
            }        
        } 

        function rotate(shape, counter){
            shape = jp(js(shape));
            var s = shape.array, t = [], y, x;
            if (counter) {
                for (y in s) s[y] = s[y].reverse();
            } else {
                s = s.reverse();
            }
            for (y=0; y<s.length; y++) {
                for (x=0; x<s[y].length; x++) {
                    t[x] || (t[x] = []);
                    t[x][y] = s[y][x];
                }
            }
            //console.log(t);
            shape.array = t;
            return shape;
        }

        function bust(matrix){
            var y, x, s, c = 0;
            for(y = matrix.array.length - 1; --y;){
                for (x=0, s=0; x<=matrix.w ; s+=!!matrix.array[y][x], x++){}
                if(s == matrix.w && ++c) matrix.array.splice(y,1);
            }
            //console.log(c,matrix);
            for (;c-- > 0; matrix.array.unshift(new Array(matrix.w).fill(0))){}
        }

        function make(){
            var s = jp(js(shapes[Object.keys(shapes)[round(rand() * 6)]]));
            s.x = 4;
            s.y = 0;
            return s;
        };

        function init() {
            size = floor(w.innerHeight / matrix.h);
            e.width  = size * matrix.w;
            e.height = size * matrix.h;
            update = 1; e.style.marginLeft = (w.innerWidth - e.width) / 2;
            
            //console.log("screen", w.innerHeight, w.innerWidth, w.orientation);
            //console.log("size", size);
        }
        
        init();
        var c = e.getContext('2d');
        var shape = make();
        
        walk(matrix, function(m,x,y){
            if (!x) m.array.push([]);
            m.array[y][x] = 0;
        });

        function loop(){
            if (update){
                walk(matrix, function(m,x,y){
                    c.fillStyle = m.array[y][x] ? m.array[y][x] : 'white';
                    c.fillRect(
                        x * size,
                        y * size, 
                        size,
                        size
                    );
                });
                walk(shape, function(s,x,y){
                    if (s.array[y][x]) {
                        c.fillStyle = shape.c;
                        c.fillRect(
                            (x + shape.x) * size,
                            (y + shape.y) * size, 
                            size,
                            size
                        );
                    }

                });
                //drawShape(c, shape);
                update = 0;
            }
            w.requestAnimationFrame(loop);
        };
        loop();

        function playerMove(d) {
            if (!collision(matrix, shape, shape.x+d, shape.y))
                update = (shape.x+=d)+1;
        }
        function playerRotate(d) {
            newShape = rotate(shape,d);
            if (!collision(matrix, newShape, newShape.x, newShape.y))
                update = shape = newShape;
        }
        function playerDown() {
            if (!collision(matrix, shape, shape.x, shape.y+1)) {
                shape.y++;
            } else {
                walk(shape, function(s, x, y){
                    if (s.array[y][x]) matrix.array[y+shape.y][x+shape.x] = s.c;
                });
                bust(matrix);
                shape = make();
            }
            update = true;
        }

        ael('touchstart', function firstBlood() {
            d.getElementById('ui').style.display = 'block';
            w.removeEventListener('touchstart', firstBlood, false);
            d.getElementById('right').addEventListener('touchstart', function(e){
                playerMove(1);
            });  
            d.getElementById('left').addEventListener('touchstart', function(e){
                playerMove(-1);
            });  
            d.getElementById('rright').addEventListener('touchstart', function(e){
                playerRotate(0);
            });  
            d.getElementById('rleft').addEventListener('touchstart', function(e){
                playerRotate(1);
            });  
            d.getElementById('down1').addEventListener('touchstart', playerDown);  
            d.getElementById('down2').addEventListener('touchstart', playerDown);  
        }, false);
        
        ael('keydown', function(e){
            //console.log(e.which);
            var k = e.which, newShape;
            // up
            if (k==88||k==89||k==38) {
                playerRotate(k%2);
            }
            // left / right
            if (k==39||k==37) {
                playerMove(k-38);
            }
            // down
            if (k==40||k==32) {
                playerDown();
            }
        });
        ael('orientationchange', init);
    })(
        w, 
        d,
        d.getElementById('stage'),
        m.random,
        m.round,
        m.floor,
        d.addEventListener,
        j.parse,
        j.stringify
    );
};




   


