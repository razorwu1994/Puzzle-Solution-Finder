var squareSize = 40;
var itrToReport = document.getElementById("itrToReport").value;
var globalMaxK=0;
/**
 * Helper function 1 for drawing puzzles in basicHillClimb
 */
var drawPuzzleHelper1 = function(r, c, xCor, yCor){
    //let unitNumber = randomNumber(maxLegalJumpNumber(puzzleSideNumber, r, c))
    drawCell(xCor, yCor, dataMatrix[r][c], 0);
    drawCell(xCor, yCor, visualizingMatrix[r][c], squareSize * puzzleSideNumber + 50);
}

/**
 * Helper function 2 for drawing puzzles for hillClimbWithRestarts and tease
 */
var drawPuzzleHelper2 = function(r, c, xCor, yCor){
    if (c == puzzleSideNumber - 1 && r == c) {
        dataMatrix[puzzleSideNumber - 1][puzzleSideNumber - 1] = 0;
        drawCell(xCor, yCor, 0, 0);
    } else
        drawCell(xCor, yCor, dataMatrix[r][c], 0);
}

/**
 * Helper function 3 for drawing puzzles for puzzleInput
 */
var drawPuzzleHelper3 = function(r, c, xCor, yCor){
    let unitNumber = randomNumber(maxLegalJumpNumber(puzzleSideNumber, r, c))
    if (c == 0) {
        dataMatrix[r][0] = unitNumber;
    } else {
        dataMatrix[r].push(unitNumber);
    }

    if (c == puzzleSideNumber - 1 && r == c) {
        dataMatrix[puzzleSideNumber - 1][puzzleSideNumber - 1] = 0
        drawCell(xCor, yCor, 0, 0);
    } else
        drawCell(xCor, yCor, unitNumber, 0);
}

/**
 * Helper function 4 for drawing puzzles for puzzleEvaluation
 */
var drawPuzzleHelper4 = function(r, c, xCor, yCor){
    let unitNumber = visualizingMatrix[r][c]
    drawCell(xCor, yCor, unitNumber, puzzleSideNumber * squareSize + 50);
}

/**
 * 
 * 
 * @param {number} puzzleSideNumber 
 * @param {number} randomRow
 * @param {number} randomCol 
 * @return {number} random valid number
 */
var randomMaxlegalNumber = function(p,r,c){
    //console.log("row "+r+" col "+c)
    return r==(p-1)&&c==r?0:randomNumber(maxLegalJumpNumber(p, r, c))
}

var verifySelection = function(randSelectionGroup,x,y){
    let loopc=0;
    while(loopc<randSelectionGroup.length && randSelectionGroup.length!==0){
        // console.log(randSelectionGroup[loopc].x.key + " | "+x)
        // console.log(randSelectionGroup[loopc].y.key + " | "+y)
        if(randSelectionGroup[loopc].x.key === x && randSelectionGroup[loopc].y.key === y)
            return false;
        loopc++;
    } 
    return true;
}

/**
 * range and a prob, will return the index that this prob located at corresponding interval
 * 
 * @param {array} selectionRange 
 * @param {number} probability 
 * @return {number} index that this probability locate at
 */
var interval = function(selectionRange,probability){
    let loopc=0;
    while(loopc<selectionRange.length){
        if(probability < parseFloat(selectionRange[loopc]))
            break;
        loopc++;
    }
    return loopc;
}

var genenaticAlgoLauncher = function(){
    var startDate = new Date();
    var endDate   = new Date();
    var finalOPTmatrix=[];
    var compTime = document.getElementById("ga_compTime").value?
    parseFloat(document.getElementById("ga_compTime").value):1.0;//default 1 second

    globalMaxK=0;
    document.getElementById("tree_section").innerText="";
    document.getElementById("k_comp").innerText="";
    
    let itr = document.getElementById("ga_iterations").value?document.getElementById("ga_iterations").value:1;
    let c=0;
    while(c<itr){
        let tempObj = populationGenerating();
        if(tempObj.finalK>globalMaxK){
            globalMaxK =tempObj.finalK;
            finalOPTmatrix = tempObj.finalMatrix;
            endDate= new Date();
        } 
        c++;
        var curDate = new Date();
        if((curDate.getTime() - startDate.getTime()) / 1000 > compTime){
            document.getElementById("k_comp").innerText=
            "stop at "+(curDate.getTime() - startDate.getTime()) / 1000 +" with "+tempObj.finalK;            
            break;
        }
    }
    // Transfer matrix with best K to data matrix
    dataMatrix = finalOPTmatrix;
    cleanCanvas(0);    
    puzzleEvaluation(false);
    // Draw matrix to screen
    drawPuzzle(drawPuzzleHelper1);
    document.getElementById("k_value").innerText = "optimized K is below";            
    document.getElementById("best_k").innerText="best K : time is "+(endDate.getTime() - startDate.getTime()) +" ms to reach k :"+globalMaxK;
}
var populationGenerating = function(){
    var popSize = document.getElementById("population_size").value;
    var mutateProb = document.getElementById("mutate_prob").value;
    var populationGroup = [];
    
    var fitnessGroup =[];//store eval, K in order, first value corresponds to first population in populationGroup
    puzzleSideNumber = parseInt(document.getElementById("input").value)
    
    let loopcounter=0;
    while(loopcounter++<popSize){
        dataMatrix = [];
        initializeMatrix();

        for (var r = 0; r < puzzleSideNumber; r++) {
                    dataMatrix.push([0])
                    for (var c = 0; c < puzzleSideNumber; c++) {
                        let unitNumber = randomNumber(maxLegalJumpNumber(puzzleSideNumber, r, c))
                        if (c == 0) {
                            dataMatrix[r][0] = unitNumber;
                        } else {
                            dataMatrix[r].push(unitNumber);
                        }
                        if (c == puzzleSideNumber - 1 && r == c) {
                            dataMatrix[puzzleSideNumber - 1][puzzleSideNumber - 1] = 0
                        } 
                    }
            }
            let tempEval = puzzleEvaluation(false);
            //this way to avoid negative fitness value
            var is_same = (array1,array2)=>(array1.length == array2.length) && array1.every((element, index)=>(
            JSON.stringify(element) === JSON.stringify(array2[index]) 
            ))
            
            if(tempEval >= 0){
            // console.log(JSON.stringify(dataMatrix))
            // console.log()
            // console.log(populationGroup.length)
            // console.log("----------------")
                if(populationGroup.map((entry,index)=>(JSON.stringify(entry))).indexOf(JSON.stringify(dataMatrix))===-1)//if no duplicate puzzle
                {
                    populationGroup.push(JSON.parse(JSON.stringify(dataMatrix)))//push fresh random puzzle into the group
                    fitnessGroup.push(puzzleEvaluation(false))//get each fitness value
                }
            }
            else{
                loopcounter--;
            }
    }

    //console.log(populationGroup.length)
    var selectionProbGroup=[];
    var add = function(a,b){
        return a + b;
    }
    let sum = fitnessGroup.reduce(add,0);
    loopcounter=0;
    while(loopcounter<populationGroup.length){
        selectionProbGroup.push(parseFloat((fitnessGroup[loopcounter]/sum).toFixed(2)))
        loopcounter++;
    }
    sum = selectionProbGroup.reduce(add,0);
    
    //this is because sometimes the sum of all cells are not adding up to 1, in this case
    //just randomly pick one cell then make change to it in order for total to get 1
    if(sum-1 !== 0){
        let randCellOffset = Math.floor(Math.random()*popSize);
        selectionProbGroup[randCellOffset] -= parseFloat(parseFloat(sum-1).toFixed(2))
    }
    //sum = parseFloat(selectionProbGroup.reduce(add,0).toFixed(1));
    //var randItrTime = document.getElementById("randitr_time");//max times to run rand selection loop

    //returns an array specifying range [1,10,50,100] means 4 interval,0-1,1-10,10-50,50-100 with right openning
    var selectionRange = selectionProbGroup.map((indieProb,i)=>(
        i==0 ?  indieProb : selectionProbGroup.reduce(function (a, b, c) {
           // console.log(a+" "+b+" "+c+" i"+i)
            if (c <= i) {
                return a + b;
            } else {
                return a;
            }
        })
    ));

    // console.log(JSON.stringify(selectionProbGroup))
    // console.log(JSON.stringify(selectionRange))
    var randSelectionGroupSum = 0,randSelectionGroup=[];
    loopcounter=0;

    while(loopcounter<popSize && randSelectionGroupSum<(popSize*popSize-1)/2){//either iteration time ends or all groups are fit enough
        let x,y;
        let individualP = Math.random();
        x=interval(selectionRange,individualP)
        individualP = Math.random();
        y=interval(selectionRange,individualP)     
        while(y===x){// if two selections get same index we have to pick different one
            individualP = Math.random();
            y=interval(selectionRange,individualP)
        }
        let temp;
        if(x > y){//extra step to swap and make x always a smaller index
            temp=x;
            x = y;
            y = temp;
        }  
        let tempObj;
        tempObj={x:{key:x,value:populationGroup[x]},y:{key:y,value:populationGroup[y]}};

        if(verifySelection(randSelectionGroup,x,y)){//if there is duplicate ,not going to take it
            randSelectionGroup.push(tempObj);
            randSelectionGroupSum++;
        }
        loopcounter++;
    }    

    // console.log(JSON.stringify(randSelectionGroup.map((entry,i)=>(
    //     entry.x.value +" and "+entry.y.value
    // ))))
    
    //random select row, at least 1
    var randomRow = function(maxRow){
        let temp = Math.floor(Math.random()*maxRow)
       return temp===0?1:temp;
    };
    
    //console.log(randSelectionGroup.length)
    var crossoverGroup=[]
    loopcounter=0;
    while(loopcounter<randSelectionGroup.length){
        let randRow = randomRow(puzzleSideNumber);//decide until which row to crossover
        let xPopulation = JSON.parse(JSON.stringify(randSelectionGroup[loopcounter].x.value)),
            xPopulationCopy = JSON.parse(JSON.stringify(xPopulation)),
            yPopulation = JSON.parse(JSON.stringify(randSelectionGroup[loopcounter].y.value)),
            yPopulationCopy = JSON.parse(JSON.stringify(yPopulation))
        
        //splice is a mutator method,so have to use two copies, the return value of splice contains delete item
        let xPartB=xPopulation.splice(randRow,puzzleSideNumber-randRow),
            xPartA=xPopulationCopy.splice(0,randRow),
            yPartB=yPopulation.splice(randRow,puzzleSideNumber-randRow),
            yPartA=yPopulationCopy.splice(0,randRow)
            //crossover
            crossoverGroup.push([...xPartA,...yPartB])
            crossoverGroup.push([...yPartA,...xPartB])
            

        loopcounter++;
    }

    //console.log(JSON.stringify(crossoverGroup))
    
    loopcounter=0;
    //determine mutate or not
    while(loopcounter<crossoverGroup.length){
        let randmutateRow = randomRow(puzzleSideNumber);//decide until which row to crossover
        if(Math.random()<mutateProb)//will mutate
        {
            // console.log("mutating")
            // console.log("before "+JSON.stringify(crossoverGroup[loopcounter][randmutateRow]))
            crossoverGroup[loopcounter][randmutateRow] = crossoverGroup[loopcounter][randmutateRow].map((entry,i)=>(
                randomMaxlegalNumber(puzzleSideNumber,randmutateRow,i)
            ))
            //console.log("after "+JSON.stringify(crossoverGroup[loopcounter][randmutateRow]))
            
        }
        loopcounter++;
    }
    
    var assignK = function(ind){
        dataMatrix=JSON.parse(JSON.stringify(ind));//copy each one
        k=puzzleEvaluation(false);
        //console.log(k);
        return k; 
    }
    //console.log(JSON.stringify(crossoverGroup))    
    let Kgroup = crossoverGroup.map((individual,index)=>(
        assignK(individual)
        )   
    )

    let finalK = Kgroup.reduce((a,b)=>a>b?a:b)
    let finalIndex = Kgroup.indexOf(finalK)
    //console.log(JSON.stringify(crossoverGroup[finalIndex]))
    // console.log(JSON.stringify(Kgroup))
    //console.log(finalK)

    return {finalK:finalK,finalMatrix:JSON.parse(JSON.stringify(crossoverGroup[finalIndex]))};
}


var fileInput = function(){  
    dataMatrix=[];
    var temp = ''
    var file = document.getElementById("fileForUpload").files[0];
    
    if (file) {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (evt) {
        temp =evt.target.result.replace(/\r/g, "\n");
            var tempArray = temp.split("\n").filter((t => t.length !=0));
            puzzleSideNumber = tempArray[0];
            tempArray = tempArray.slice(1,tempArray.length)
            cleanCanvas(0);
            var xCor = 0,
            yCor = 0;
            for (var r = 0; r < puzzleSideNumber; r++) {
                dataMatrix.push([0])
                yCor = r * squareSize;
                let charArray = tempArray[r].split(' ')
                //console.log(JSON.stringify(charArray))
                if(charArray.length !== tempArray.length){
                    alert("please upload a square like data");
                    return;
                }
            
                for (var c = 0; c < puzzleSideNumber; c++) {
                    let unitNumber = charArray[c]
                    //console.log(unitNumber)
                    if (c == 0) {
                        dataMatrix[r][0] = unitNumber;
                    } else {
                        dataMatrix[r].push(unitNumber);
                    }
                
                    xCor = c * squareSize;
                    if (c == puzzleSideNumber - 1 && r == c) {
                        dataMatrix[puzzleSideNumber - 1][puzzleSideNumber - 1] = 0
                        drawCell(xCor, yCor, 0, 0);
                    } else
                        drawCell(xCor, yCor, unitNumber, 0);
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

var initializeMatrix = function () {
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

var globalMathE = function () {
    return Math.pow(2, Math.LOG2E);
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
    itrToReport = document.getElementById("itrToReport").value?document.getElementById("itrToReport").value:5;
    
    //console.log(allowDownhill)
    globalMaxK =0;
    var startDate = new Date();
    // declare time
    var endDate   = new Date();

    var itrInput = document.getElementById("climb_iteration").value;
    var itrToReport = document.getElementById("itrToReport").value;        
    var p = document.getElementById("prob_downhill").value; // probability of allowing a downhill move
    var randNum;
    var temperature, decayrate;

    if (allowDownhill === "basic") {//if basic p = 0
        p = 0;
    } else {//if randwalk or anneal
        if (allowDownhill === "randwalk") {
            if (p <= 1)
                p = document.getElementById("prob_downhill").value;
            else
                p = 1;
        }
        else if (allowDownhill === "anneal") {
            p = 1;//p is dynamically changing after each iteration
            temperature = document.getElementById("init_temperature").value; // probability of allowing a downhill move
            decayrate = document.getElementById("decayrate_temperature").value; // probability of allowing a downhill move
            if (decayrate >= 1) {
                alert("please enter smaller than 1 value");
                return;
            }
        }
    }

    var report = document.getElementById("report_area");
    report.innerText=""
    
    var iteration = 0;
    while (iteration++ < itrInput) {
        var prevEval = puzzleEvaluation(false);
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
                //console.log("no more options")
                break;
            }
        }

        dataMatrix[rRandom][cRandom] = unitNumber;

        cleanCanvas(squareSize * puzzleSideNumber + 50);
        var postEval = puzzleEvaluation(true);


                //calculate the p if it is annealing
        if (allowDownhill === "anneal") {
            if (postEval <= prevEval)//downhill
            {
                p = Math.pow(globalMathE(), (postEval - prevEval) / temperature)
            }
            temperature *= decayrate//update the temprature
            //console.log("eval: "+postEval+" at " + temperature);
        }
        // Get a random number, x, to compare against p
        randNum = Math.random();
        
        var k = prevEval;
        //revert , when p is 1 , it is never reverted and downhill guaranteed
        if (postEval < prevEval && randNum >= p) {
            dataMatrix[rRandom][cRandom] = prevMatrix[rRandom][cRandom];
            k = puzzleEvaluation(true);            
        }
        else if(postEval >= globalMaxK){
            endDate  = new Date();  
            globalMaxK = postEval;   
            //console.log(prevEval+" "+postEval);
        }
        iteration%itrToReport===0?report.innerText+=" , "+iteration+":"+k:
        {}
        //console.log("k  "+k+" temp at "+temperature)
    }
    if (allowDownhill === "basic" )  {
        document.getElementById("best_k").innerText="best K : time is "+(endDate.getTime() - startDate.getTime()) 
        +" ms to reach k :"+globalMaxK +" and by the way the max is the same as final result k";
    }
    else{
        document.getElementById("best_k").innerText="best K : time is "+(endDate.getTime() - startDate.getTime())
        +" ms to reach k :"+globalMaxK;
    }
    cleanCanvas(0);
    drawPuzzle(drawPuzzleHelper1);
    // console.log("Matrix: " + dataMatrix);

    if (postEval < prevEval) {
        return prevEval;
    } else {
        return postEval;
    }
}

/**
 * Hill climb with random restarts by running several hill climbs and picking the best resulting puzzle
 * Must have a value in # of iterations and # of restarts in the GUI
 */
var hillClimbWithRestarts = function () {
    var startDate = new Date();
    // declare time
    var endDate   = new Date();

    var num_restarts = document.getElementById("num_restarts").value
    //console.log("# restarts = " + num_restarts);
    var currEvalValue;
    var bestPuzzle = [];
    var bestEvalValue;

    var report = document.getElementById("report_area");
    report.innerText=""
    
    // For each restart iteration, generate a puzzle, hill climb with given # of iterations and compare against the best puzzle found so far
    var i;
    for (i = 0; i < num_restarts; i += 1) {
        //console.log("restart " + i + ": ");
        report.innerText+="# "+i+" restart -->"
        // Generate puzzle and copy data matrix over
        puzzleInput();
        var currEvalValue = basicHillClimb();
        currPuzzle = JSON.parse(JSON.stringify(dataMatrix));

        // On first iteration, copy over matrix and its evaluated function value
        if (i == 0) {
            bestPuzzle = JSON.parse(JSON.stringify(currPuzzle));
            bestEvalValue = currEvalValue;
            endDate = new Date();
            // Otherwise if the current value is better, replace the best matrix with the current one
        } else if (currEvalValue > bestEvalValue) {
            bestPuzzle = JSON.parse(JSON.stringify(currPuzzle));
            bestEvalValue = currEvalValue;
            endDate = new Date();
        }
    }
    document.getElementById("best_k").innerText="best K : time is "+(endDate.getTime() - startDate.getTime())
    +" ms to reach k :"+bestEvalValue +" and by the way the max is the same as final result k";
    // Draw best matrix and its evaluation matrix to the screen
    dataMatrix = JSON.parse(JSON.stringify(bestPuzzle));

    puzzleSideNumber = parseInt(document.getElementById("input").value)
    cleanCanvas(0);
    initializeMatrix();
    drawPuzzle(drawPuzzleHelper2);
    puzzleEvaluation(true);
}

var tease = function () {
    document.getElementById("eval").disabled = false;
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

    puzzleSideNumber = 5;

    cleanCanvas(0);
    initializeMatrix();
    drawPuzzle(drawPuzzleHelper2);
}

var puzzleCombo = function () {
    puzzleInput()
    puzzleEvaluation(true)
}

/**
 * Generate a valid, random puzzle based on the chosen size
 */
var puzzleInput = function () {
    document.getElementById("eval").disabled = false;
    document.getElementById("k_value").innerText = ""
    document.getElementById("tree_section").innerText = ""
    dataMatrix = [];
    theTree = [];

    cleanCanvas(0);

    puzzleSideNumber = parseInt(document.getElementById("input").value)
    initializeMatrix();
    drawPuzzle(drawPuzzleHelper3, true)

    //console.log to show the matrix ===>
    //console.log(JSON.stringify(visitMatrix))
    //console.log(JSON.stringify(dataMatrix))
    //console.log(JSON.stringify(visualizingMatrix))
}

/**
 * 
 * 
 * @param {boolean} drawORnot determines whether draw the visualizing matrix or not
 * @return {number} the fitness value for this k
 */
var puzzleEvaluation = function(drawORnot) {
    //console.log("=================================================")
    //console.log(JSON.stringify(dataMatrix))
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

    var treePush = function (cord) {
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

    if(drawORnot){
        drawPuzzle(drawPuzzleHelper4);
        document.getElementById("tree_section").innerText = "The tree data structure is :" + JSON.stringify(theTree.slice(0, theTree.length - 2))    
    }

    //this will print the matrix with no solution to goal cube
    if (visualizingMatrix[puzzleSideNumber - 1][puzzleSideNumber - 1] === "X") {
        drawORnot?document.getElementById("k_value").innerText = "final K is " +
            parseInt(countOfzeroes) * (-1):{}
        //console.log("unsolvable case "+JSON.stringify(dataMatrix))
        return parseInt(countOfzeroes) * (-1) //this is the k
    } else {
        drawORnot?document.getElementById("k_value").innerText = "final K is " +
            visualizingMatrix[puzzleSideNumber - 1][puzzleSideNumber - 1]:{}
        return visualizingMatrix[puzzleSideNumber - 1][puzzleSideNumber - 1] //this is the k
    }

}

var maxLegalJumpNumber = function (Rmax, r, c) {
    return Math.max(Rmax - r, r - 1, Rmax - c, c - 1);

}

/**
 * Draws a cell on the grid based on a position (x,y) and the offset given.
 * Places the given number inside the cell.
 */
var drawCell = function (x, y, number, offset) {
    //console.log("("+x+","+y+")")
    var ctx = document.getElementById("dummy").getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.strokeStyle = "green";
    ctx.rect(offset + x, 0 + y, squareSize, squareSize);
    ctx.stroke();

    ctx.font = "20px Georgia";
    ctx.fillText(number, offset + x + squareSize / 4, 0 + (y + 10) + squareSize / 2);

}

var randomNumber = function (max) {
    var temp = Math.random()
    return Math.floor(temp * (max)) == 0 ?
        Math.ceil(temp * (max)) : Math.floor(temp * (max))
}

/**
 * Draws the entire puzzle.
 * Make sure puzzleSideNumber is set before hand.
 * 
 * @param <function> drawingHelper helper function for customizing how the puzzle is drawn
 * @param <boolean> option special flag for inputPuzzle()
 */
var drawPuzzle = function (drawingHelper, option=false) {
    var xCor = 0,
        yCor = 0;

    squareSize = 40;
    for (var r = 0; r < puzzleSideNumber; r++) {
        yCor = r * squareSize;

        if(option === true){
            dataMatrix.push([0])            
        }
        
        for (var c = 0; c < puzzleSideNumber; c++) {
            xCor = c * squareSize;
            drawingHelper(r, c, xCor, yCor);
        }
        xCor = 0;
    }
}