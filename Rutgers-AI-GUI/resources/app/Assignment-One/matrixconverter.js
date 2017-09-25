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
                console.log("File has been saved");
            });
        }
    } 
    

}
