// Each celll is in one of two possible states, alive or dead.

// The following transitions occur:

// 1. Any live cell with fewer than two live neighbors dies, as if caused by under-population.
// 2. Any live cell with two or three live neighbors lives on to the next generation.
// 3. Any live cell with more than three live neighbors dies, as if by overcrowding.
// 4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

// A tick is the transition from one generation to the next.

$(document).ready(function () {
    life.makeCells(510, 510, 10);
    life.neighborfy();
    life.chooseSetup(life.setups[0])
    life.cycle();
})

var life = {};

// all cells
life.cells = [];
// push cells that change to next gen
life.tick = [];
// condition for whether cell lives
life.map = [false, false, true, true, false, false, false, false, false];
// setups
life.setups = [
    [
        {
            x: 25,
            y: 24
        },
        {
            x: 25,
            y: 26
        },,
        {
            x: 24,
            y: 25
        },,
        {
            x: 26,
            y: 25
        }
    ]
]

// to generate random hex value
life.baseColor = (function () {
    var color = '#', index;
    var values = '1234567890abcdef'.split('');

    for (var i = 0; i < 6; i++) {
        index = Math.floor(Math.random() * 16);
        color += values[index];
    }

    return color;
})()

life.Cell = function (options) {
    this.x = options.x;
    this.y = options.y;
    this.alive = options.alive;
    this.neighbors = [];
    this.el = $('<div class="cell"></div>');
}

// set cell color
life.Cell.prototype.setColor = function (x, y) {
    this.color = colorLuminance(life.baseColor, ((Math.abs(this.x - x / 2) + Math.abs(this.y - y / 2)) * .02));
    return this;
}

life.Cell.prototype.enter = function () {
    $('#life').append(this.el);
    return this;
}

// calls life.makeNeighbors on each sell
life.neighborfy = function () {
    _.each(this.cells, function (row) {
        _.each(row, function (cell, index) {
            // passing cell, number of cells in row, number of cells in column
            this.makeNeighbors(cell);
        }.bind(this))
    }.bind(this))
}

// relating cells with neighboring cells
life.makeNeighbors = function (cell) {
    var y = cell.y - 1;

    for (; y < cell.y + 2; y++) {
        for (var x = cell.x - 1; x < cell.x + 2; x++) {
            // if this is not the location of the current cell, push that neighba!
            if (!(y === cell.y && x === cell.x) && (life.cells[y] !== undefined) && (life.cells[y][x] !== undefined)) cell.neighbors.push(life.cells[y][x]);
        }
    }
}

// checking neighbors of each cell
life.checkNeighbors = function () {
    var that = this;
    _.each(this.cells, function (row) {
        _.each(row, function (cell) {
            that.setTick(cell, (_.reduce(_.map(cell.neighbors, function (neighbor) {
                return (neighbor.alive ? 1 : 0);
            }), function (m, n) { return m + n })));
        })
    })
    return this;
}

// push cells that need changing
life.setTick = function (cell, living) {
    if (this.map[living] !== cell.alive) this.tick.push(cell)
}

// tick to the next gen
life.runTick = function () {
    _.each(this.tick, function (cell) {
        cell.alive = !cell.alive;
        cell.el.css('background', cell.alive ? cell.color : '#FFF');
    })
    this.tick = [];
}

// the cycle of life
life.cycle = function () {
    setInterval(function() {
        this.checkNeighbors().runTick();
    }.bind(this), 300)
}

// life.Cell.prototype.clickEvent = function () {
//     this.el.on('click', function () {
//         console.log(this.x + ', ' + this.y)
//         this.alive = true;
//         this.el.css('background', '#000');
//     }.bind(this));
//     return this;
// }

life.makeCells = function (x, y, size) {
    var xCells = x / size;
    var yCells = y / size;

    for (var y = 0; y < yCells; y++) {
        this.cells.push([])
        for (var x = 0; x < xCells; x++) {
            this.cells[y].push(new this.Cell({ x: x, y: y, alive: false}).enter().setColor(xCells, yCells));
        }
    }
}

life.chooseSetup = function (setup) {
    _.each(setup, function (position) {
        var cell = life.cells[position.y][position.x];
        cell.alive = true;
        cell.el.css('background', cell.color);
    })
}


// function random () {
//     return !Boolean(Math.floor(Math.random() * 10));
// }

// curtosy of Craig Buckler: http://www.sitepoint.com/javascript-generate-lighter-darker-color/
function colorLuminance(hex, lum) {

    // validate hex string
    var hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    var lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00"+c).substr(c.length);
    }

    return rgb;
}
