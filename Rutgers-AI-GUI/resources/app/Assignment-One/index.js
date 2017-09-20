var squareSize = 40;


var fileInput = function(){  
    var temp = ''

    var file = document.getElementById("fileForUpload").files[0];
    
    if (file) {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (evt) {
            temp =evt.target.result.replace(/\r/g, "\n");
            var tempArray = temp.split("\n").filter((t => t.length !=0));
            puzzleSideNumber = tempArray.length;
            var xCor = 0,
            yCor = 0;
            for (var r = 0; r < puzzleSideNumber; r++) {
            dataMatrix.push([0])
            yCor = r * squareSize;
            let charArray = tempArray[r].split(' ')
            console.log(JSON.stringify(charArray))
            
            for (var c = 0; c < puzzleSideNumber; c++) {
                let unitNumber = charArray[c]
                console.log(unitNumber)
                if (c == 0) {
                    dataMatrix[r][0] = unitNumber;
                } else {
                    dataMatrix[r].push(unitNumber);
                }
                
                xCor = c * squareSize;
                if (c == puzzleSideNumber - 1 && r == c) {
                    dataMatrix[puzzleSideNumber - 1][puzzleSideNumber - 1] = 0
                    drawPuzzle(xCor, yCor, 0, 0);
                } else
                    drawPuzzle(xCor, yCor, unitNumber, 0);
            }
            xCor = 0;
        }
    
            // temp = evt.target.result.replace(/\r/g, "<br/>");
            // document.getElementById("fileContents").innerHTML = temp;
        }
        reader.onerror = function (evt) {
            document.getElementById("fileContents").innerHTML = "error reading file";
        }
    }
}
var cleanCanvas = function(offset) {
    var canvas = document.getElementById("dummy")
    var ctx = canvas.getContext("2d"); 
    var width = canvas.width,
        height = canvas.height
        //console.log("w:"+width+"  h:"+height)
    ctx.clearRect(offset, 0, width, height);
}
var initializeMatrix = function() {
    visualizingMatrix = []
    visitMatrix = []
    for (var r = 0; r < puzzleSideNumber; r++) {
        visualizingMatrix.push(["X"])
        visitMatrix.push([0])
        for (var c = 0; c < puzzleSideNumber; c++) {
            if (c == 0) {
                visitMatrix[r][0] = 0;
                visualizingMatrix[r][0] = "X";
            } else {
                visitMatrix[r].push(0);
                visualizingMatrix[r].push("X")
            }
        }

    }

}


var globalMathE = function(){
    return Math.pow(2,Math.LOG2E);
}

/**
 * Take the current data matrix, then pick a random cell (besides the goal), and change it.
 * If the new matrix is better than the current matrix, keep the change.
 * Otherwise keep the old matrix.
 * 
 * @param {string} allowDownhill determines whether downhill movement is allowed
 * @return {number} evaluation function value for the new matrix after hill climbing
 */
var basicHillClimb = function(allowDownhill) {
    console.log(allowDownhill)
    var itrInput = document.getElementById("climb_iteration").value;
    var p = document.getElementById("prob_downhill").value; // probability of allowing a downhill move
    var randNum;
    var temperature,decayrate;
    
    if(allowDownhill==="basic"){//if basic p = 0
        p = 0;
    }else{//if randwalk or anneal
        if(allowDownhill==="randwalk"){
        if(p<=1)
        p = document.getElementById("prob_downhill").value;
        else
        p=1;
        }
        else if(allowDownhill==="anneal"){
         p = 1;//p is dynamically changing after each iteration
         temperature = document.getElementById("init_temperature").value; // probability of allowing a downhill move
         decayrate = document.getElementById("decayrate_temperature").value; // probability of allowing a downhill move
         if(decayrate>=1){
             alert("please enter smaller than 1 value");
             return;
         }
        }
    }   

    var iteration = 0;
    while (iteration++ < itrInput) {

        var prevEval = puzzleEvaluation();
        var prevMatrix = JSON.parse(JSON.stringify(dataMatrix))

        var rRandom = Math.floor(Math.random() * puzzleSideNumber)
        var cRandom = Math.floor(Math.random() * puzzleSideNumber)
        while (rRandom === cRandom && rRandom === puzzleSideNumber - 1) //Goal number needn't be changed
        {
            rRandom = Math.floor(Math.random() * puzzleSideNumber)
            cRandom = Math.floor(Math.random() * puzzleSideNumber)
        }
        var unitNumber = randomNumber(maxLegalJumpNumber(puzzleSideNumber, rRandom, cRandom))
        var count = 0;
        while (unitNumber === dataMatrix[rRandom][cRandom]) {
            unitNumber = randomNumber(maxLegalJumpNumber(puzzleSideNumber, rRandom, cRandom))
            if (count++ > 5) {
                console.log("no more options")
                break;
            }
        }



        dataMatrix[rRandom][cRandom] = unitNumber;

        cleanCanvas(squareSize * puzzleSideNumber + 50);
        
        var postEval = puzzleEvaluation();

        //calculate the p if it is annealing
        if(allowDownhill==="anneal"){
            if(postEval<=prevEval)//downhill
            {
                p=Math.pow(globalMathE(),(postEval-prevEval)/temperature)
            }
            temperature *=decayrate//update the temprature
            //console.log("eval: "+postEval+" at " + temperature);
        }
        // Get a random number, x, to compare against p
        // If x <= p, then allow downhill movement ????
        randNum = Math.random();


        var k =prevEval;
        //revert , when p is 1 , it is never reverted and downhill guaranteed
        if(postEval < prevEval && randNum >= p) { 
            dataMatrix[rRandom][cRandom] = prevMatrix[rRandom][cRandom];
            k = puzzleEvaluation();
        }
        //console.log("k  "+k+" temp at "+temperature)
        
        cleanCanvas(0);
        var xCor = 0,
            yCor = 0;
        squareSize = 40;
        for (var r = 0; r < puzzleSideNumber; r++) {
            yCor = r * squareSize;
            for (var c = 0; c < puzzleSideNumber; c++) {
                xCor = c * squareSize;
                drawPuzzle(xCor, yCor, dataMatrix[r][c], 0);
                drawPuzzle(xCor, yCor, visualizingMatrix[r][c], squareSize * puzzleSideNumber + 50);
            }
            xCor = 0;
        }
    }

    // console.log("Evaluated value: " + postEval);
    // console.log("Matrix: " + dataMatrix);

    if(postEval < prevEval){
        return prevEval;
    }else{
        return postEval;
    }
}

/**
 * Hill climb with random restarts by running several hill climbs and picking the best resulting puzzle
 * Must have a value in # of iterations and # of restarts in the GUI
 */
var hillClimbWithRestarts = function() {
    var num_restarts = document.getElementById("num_restarts").value
    console.log("# restarts = " + num_restarts);
    var currEvalValue;
    var bestPuzzle = [];
    var bestEvalValue;

    // For each restart iteration, generate a puzzle, hill climb with given # of iterations and compare against the best puzzle found so far
    var i;
    for(i = 0; i < num_restarts; i += 1){
        console.log("restart " + i + ": ");

        // Generate puzzle and copy data matrix over
        puzzleInput();
        var currEvalValue = basicHillClimb();
        currPuzzle = JSON.parse(JSON.stringify(dataMatrix));

        // On first iteration, copy over matrix and its evaluated function value
        if(i == 0){
            bestPuzzle = JSON.parse(JSON.stringify(currPuzzle));
            bestEvalValue = currEvalValue;
        // Otherwise if the current value is better, replace the best matrix with the current one
        }else if(currEvalValue > bestEvalValue){
            bestPuzzle = JSON.parse(JSON.stringify(currPuzzle));
            bestEvalValue = currEvalValue;
        }
    }

    // Draw best matrix and its evaluation matrix to the screen
    dataMatrix = JSON.parse(JSON.stringify(bestPuzzle));

    cleanCanvas(0);
    puzzleSideNumber = parseInt(document.getElementById("input").value)    
    initializeMatrix();
    var xCor = 0,
        yCor = 0;
    for (var r = 0; r < puzzleSideNumber; r++) {
        yCor = r * squareSize;
        for (var c = 0; c < puzzleSideNumber; c++) {
            xCor = c * squareSize;
            if (c == puzzleSideNumber - 1 && r == c) {
                dataMatrix[puzzleSideNumber - 1][puzzleSideNumber - 1] = 0
                drawPuzzle(xCor, yCor, 0, 0);
            } else
                drawPuzzle(xCor, yCor, dataMatrix[r][c], 0);
        }
        xCor = 0;
    }

    puzzleEvaluation();
}




var tease = function() {
    document.getElementById("eval").disabled=false;
    // dataMatrix = [
    //     ["2", "2", "2", "4", "3"],
    //     ["2", "2", "3", "3", "3"],
    //     ["3", "3", "2", "3", "3"],
    //     ["4", "3", "2", "2", "2"],
    //     ["1", "2", "1", "4", "0"],
    // ];success example
    dataMatrix = [
        ["3", "3", "2", "4", "3"],
        ["2", "2", "2", "1", "1"],
        ["4", "3", "1", "3", "4"],
        ["2", "3", "1", "1", "3"],
        ["1", "1", "3", "2", "0"],
    ]; //fail example  example

    cleanCanvas(0);

    puzzleSideNumber = 5

    initializeMatrix();
    var xCor = 0,
        yCor = 0;
    for (var r = 0; r < puzzleSideNumber; r++) {
        yCor = r * squareSize;
        for (var c = 0; c < puzzleSideNumber; c++) {
            xCor = c * squareSize;
            if (c == puzzleSideNumber - 1 && r == c) {
                dataMatrix[puzzleSideNumber - 1][puzzleSideNumber - 1] = 0
                drawPuzzle(xCor, yCor, 0, 0);
            } else
                drawPuzzle(xCor, yCor, dataMatrix[r][c], 0);
        }
        xCor = 0;
    }

}



var puzzleCombo = function() {
    puzzleInput()
    puzzleEvaluation()
}

/**
 * Generate a valid, random puzzle based on the chosen size
 */
var puzzleInput = function() {
    document.getElementById("eval").disabled = false;
    document.getElementById("k_value").innerText = ""
    document.getElementById("tree_section").innerText = ""
    dataMatrix = [];
    theTree = [];

    cleanCanvas(0);

    puzzleSideNumber = parseInt(document.getElementById("input").value)
    initializeMatrix();

    var xCor = 0,
        yCor = 0;
    for (var r = 0; r < puzzleSideNumber; r++) {

        dataMatrix.push([0])
        yCor = r * squareSize;
        for (var c = 0; c < puzzleSideNumber; c++) {
            let unitNumber = randomNumber(maxLegalJumpNumber(puzzleSideNumber, r, c))
            if (c == 0) {
                dataMatrix[r][0] = unitNumber;
            } else {
                dataMatrix[r].push(unitNumber);
            }

            xCor = c * squareSize;
            if (c == puzzleSideNumber - 1 && r == c) {
                dataMatrix[puzzleSideNumber - 1][puzzleSideNumber - 1] = 0
                drawPuzzle(xCor, yCor, 0, 0);
            } else
                drawPuzzle(xCor, yCor, unitNumber, 0);
        }
        xCor = 0;
    }

    //console.log to show the matrix ===>
    //console.log(JSON.stringify(visitMatrix))
    //console.log(JSON.stringify(dataMatrix))
    //console.log(JSON.stringify(visualizingMatrix))
}
var puzzleEvaluation = function() {
    //console.log("=================================================")
    initializeMatrix();
    document.getElementById("eval").disabled = true;
    var depth = 0;
    //x+y to represent the location
    //initialize the queue at beginning
    dataQueue = ['0+0', '|'];
    theTree = ['(0,0)', '|'];
    visitMatrix[0][0] = 1 //visited, so change to 1

    var barIndex = 0;
    var levelEnder = "";

    var treePush = function(cord) {
        if ((cord.split(",")[0] === ("(" + (puzzleSideNumber - 1))) &&
            (cord.split(",")[1] === ((puzzleSideNumber - 1) + ")"))) {
            cord = "(G,G)"
        }
        theTree.push(cord)
    }
    while (dataQueue && dataQueue.length != 0) {
        var barFlag = false;
        //console.log(JSON.stringify(dataQueue))

        if (dataQueue.lastIndexOf('|') == dataQueue.length - 1) {
            barIndex = dataQueue.lastIndexOf('|');
            levelEnder = dataQueue[barIndex - 1];
        }
        var dequedItem = dataQueue.splice(0, 1)[0]; //remove the first one element from array with(index,deletecount) and assign it
        if (dequedItem[0] === '|') {
            depth++
            dequedItem = dataQueue.splice(0, 1)[0]; //continue to retrieve next depth node
            if (!dequedItem || dequedItem.length == 0 || dequedItem[0] === '|') {
                break;
            }

        }

        if (dequedItem == levelEnder) //we found the last one of a level
            barFlag = true
            // console.log("dequedItem" + dequedItem);
            // console.log("depth : " + depth)

        var pivot = dequedItem.split('+')
        var c = parseInt(pivot[0]) //c
        var r = parseInt(pivot[1]) //r

        // console.log(JSON.stringify(dequedItem))
        // console.log(r + "," + c)

        visualizingMatrix[r][c] = depth;
        var availableMove = parseInt(dataMatrix[r][c]);
        //console.log("available move : " + availableMove + " at(" + r + "," + c + ")")

        //four options to go !important, follow by right,down,left,up order (clockwise) 
        var HorizontalMoves = [parseInt(c + availableMove), parseInt(c - availableMove)]
        var VerticalMoves = [parseInt(r + availableMove), parseInt(r - availableMove)]
        for (let temp = 0; temp < 2; temp++) {
            if (HorizontalMoves[temp] < puzzleSideNumber && HorizontalMoves[temp] >= 0)
                if (visitMatrix[HorizontalMoves[temp]][r] == 0) //if not visited
                {
                    dataQueue.push(HorizontalMoves[temp] + "+" + r);
                    treePush("(" + HorizontalMoves[temp] + "," + r + ")")
                    visitMatrix[HorizontalMoves[temp]][r] = 1 //visited, so change to 1
                }
            if (VerticalMoves[temp] < puzzleSideNumber && VerticalMoves[temp] >= 0)
                if (visitMatrix[c][VerticalMoves[temp]] == 0) //if not visited
                {
                    dataQueue.push(c + "+" + VerticalMoves[temp]);
                    treePush("(" + c + "," + VerticalMoves[temp] + ")")
                    visitMatrix[c][VerticalMoves[temp]] = 1 //visited, so change to 1
                }
        }
        if (barFlag) {
            dataQueue.push("|") //add spliter
            theTree.push("|");
        }


    }

    var countOfzeroes = 0;
    for (var i in visitMatrix) {
        for (var j in visitMatrix[i])
            if (visitMatrix[i][j] == 0) countOfzeroes++
    }
    //console.log(JSON.stringify(countOfzeroes))

    var xCor = 0,
        yCor = 0;
    for (var r = 0; r < puzzleSideNumber; r++) {
        yCor = r * squareSize;
        for (var c = 0; c < puzzleSideNumber; c++) {
            let unitNumber = visualizingMatrix[r][c]
            xCor = c * squareSize;
            drawPuzzle(xCor, yCor, unitNumber, puzzleSideNumber * squareSize + 50);
        }
        xCor = 0;
    }

    document.getElementById("tree_section").innerText = "The tree data structure is :" + JSON.stringify(theTree.slice(0, theTree.length - 2))

    //this will print the matrix with no solution to goal cube
    if (visualizingMatrix[puzzleSideNumber - 1][puzzleSideNumber - 1] === "X") {
        document.getElementById("k_value").innerText = "K is " +
            parseInt(countOfzeroes) * (-1)
        console.log(JSON.stringify(dataMatrix))
        return parseInt(countOfzeroes) * (-1) //this is the k
    } else {
        document.getElementById("k_value").innerText = "K is " +
            visualizingMatrix[puzzleSideNumber - 1][puzzleSideNumber - 1]
        return visualizingMatrix[puzzleSideNumber - 1][puzzleSideNumber - 1] //this is the k
    }

}

var maxLegalJumpNumber = function(Rmax, r, c) {
    return Math.max(Rmax - r, r - 1, Rmax - c, c - 1);

}

var drawPuzzle = function(x, y, number, offset) {
    //console.log("("+x+","+y+")")
    var ctx = document.getElementById("dummy").getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.strokeStyle = "green";
    ctx.rect(offset + x, 0 + y, squareSize, squareSize);
    ctx.stroke();

    ctx.font = "15px Georgia";
    ctx.fillText(number, offset + x + squareSize / 2, 0 + y + squareSize / 2);

}

var randomNumber = function(max) {
    var temp = Math.random()
    return Math.floor(temp * (max)) == 0 ?
        Math.ceil(temp * (max)) : Math.floor(temp * (max))
}