'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('rel-buslines.json');
let lines = JSON.parse(rawdata).elements;
let stops = new Set();

lines.forEach(line => {
    line.members.forEach(member => {
        if (member.type ==="node" && member.role.match("^stop")) {
            stops.add(member.ref);
            //console.log(member.role + member.ref);
        }
    });
});


//console.log(lines[0].members[0]);
//console.log(lines[0].members[1]);
//console.log(lines[0].members[2]);
//console.log(lines[0].members[3]);
console.log(stops);