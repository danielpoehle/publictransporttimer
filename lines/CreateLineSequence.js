'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('rel-buslines.json');
let lines = JSON.parse(rawdata).elements;
rawdata = fs.readFileSync('names-stops.json');
let stops = JSON.parse(rawdata).elements;

let lineFrame = new Array();

lines.forEach(line => {
    let tempLine = {ID: line.id,
                    name: line.tags.name};
    tempLine.from = line.tags.from;
    tempLine.to = line.tags.to;
    tempLine.number = Number(line.tags.ref);
    tempLine.StopsIdx = [];
    tempLine.StopNames = [];
    //console.log(tempLine);
    line.members.forEach(member => {
        if (member.type ==="node" && member.role.match("^stop")) {
            var result = stops.find(stop => {
                return stop.id === member.ref;
              });
            //console.log(result);
            if(typeof result !== "undefined"){
                tempLine.StopsIdx.push(result.id);
                if(typeof result.tags !== "undefined"){
                    if(typeof result.tags !== "undefined"){
                        tempLine.StopNames.push(result.tags.name);
                    }else{
                        tempLine.StopNames.push(result.id);
                    }                    
                }else{
                    tempLine.StopNames.push(result.id);
                }                
            }else{
                throw new Error("Stop is not in the list of stops!");
            }
        }
    });
    lineFrame.push(tempLine);
});

fs.writeFileSync('./lineFrame.json', JSON.stringify(lineFrame, null, 2) , 'utf-8');

//console.log(lines[0]);
//console.log(stops);
console.log(lineFrame[0]);