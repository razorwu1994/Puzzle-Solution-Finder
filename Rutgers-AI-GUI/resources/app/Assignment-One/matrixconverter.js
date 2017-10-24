var fs = require("fs");
var report,temp;
    
var convertToMatrix = function(){
    var file = document.getElementById("fileForUpload").files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (evt) {
            temp =JSON.parse(evt.target.result);
            var i,j;    
            report=temp.length+"\n"
            for(i=0;i<temp.length;i++){
                for(j=0;j<temp.length;j++){
                    if(j==0)report+=temp[i][j]
                    else report+=" "+temp[i][j]
                }
                report+="\n"
            }
            fs.appendFile("./matrix.txt", report+"\n", (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
                //console.log("File has been saved");
            });
        }
    } 
}

var flatMatrixToFile = function(){
    var file = document.getElementById("fileForUpload").files[0];
    var DataSet=[];
    if (file) {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (evt) {
            let size = evt.target.result.split("\n")[0]
            temp = evt.target.result.split("\n").slice(1)
            let i,j;
            for(i=0; i<size;i++){
                let piece = temp[i].split(" ")
                for(j=0; j<size;j++){
                    DataSet.push(piece[j])
                }
            }
            // DataSet = DataSet[0].split(" ")
            console.log(DataSet)
            fs.writeFile("./flattenMatrix.txt", DataSet+"\n", (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
                console.log("File has been flatten to ./flattenMatrix.txt");
            });
        }
    } 

}
