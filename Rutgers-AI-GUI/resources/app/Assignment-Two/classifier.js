
var fs = require("fs");

var runClassifier = function(){
    
let mode = document.getElementById("-c").value
let trainningData = document.getElementById("-t").value
let testingData = document.getElementById("-s").value
let iteration = document.getElementById("-i").value

var myPythonScriptPath = './Assignment-Two/python/dataClassifier.py';
// Use python shell
var PythonShell = require('python-shell');
var options = {
    mode: 'text',
    args: ['-c',mode,'-t', trainningData,'-s',testingData,'-i',iteration]
};
    console.log("start")
PythonShell.run(myPythonScriptPath, options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    fs.writeFile("./Assignment-Two/report.doc", results+"\n", (err) => {
        if (err) {
            console.error(err);
            return;
        };
    });
    console.log("finish")
});

}


