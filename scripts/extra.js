// displaying nums for the cells
function displayTickMarks (x, y) {
    var ticks = '';
    for (var i = 0; i < x; i++) {
        ticks += '<span>' + (i < 10 ? ('0' + i) : i) + '</span>'
        // ticks += '<span>' + i + '</span>'
    }
    $('.x').append(ticks);

    ticks = '';
    for (var i = 0; i < y; i++) {
        ticks += '<span>' + i + '</span>'
    }
    $('.y').append(ticks);
}

// pushing x and y positions of all living cells
function isAlive () {
    var pattern = [];
    _.each(life.cells, function (row) {
        _.each(row, function (cell) {
            if (cell.alive) pattern.push({x: cell.x, y: cell.y})
        })
    })
    return pattern
}

// a way of printing out the code for the pattern on screen
function printIt (pattern) {
    var corner = {
        x: _.min(_.map(pattern, function(position) {return position.x})),
        y: _.min(_.map(pattern, function(position) {return position.y}))
    }

    var str = '{includeInitial:'
    // establish whether initial corner is part of pattern or not
    if (corner.x === pattern[0].x && corner.y === pattern[0].y) {
        str += 'true';
        // remove first position, since it is absolute
        pattern.shift(0);
    } else {
        str += 'false';
    }
    str += ',pattern:['
    // relate all other positions to top left corner of pattern
    _.each(pattern, function(position) {
        str += '{x:' + (position.x - corner.x) + ',y:' + (position.y - corner.y) + '},'
    })
    console.log(str += ']}')
}
