function deleteRow(id){
    console.log("Row with id# " + id + " will be deleted");
}

function displayTable(newData){
    if(document.getElementById("dataTable")){
        document.getElementById("tableToBeConstructed").removeChild(document.getElementById("dataTable"));
    }

    // Construct a new table on the HTML page using returned data from database

    var newTable = document.createElement("table");
    newTable.id = "dataTable";
    newTable.style.border = "solid";
    newTable.style.borderWidth = "1px";

    var headRow = document.createElement("tr");

    var nameHeader = document.createElement("th");
    nameHeader.textContent = "Exercise Name";
    nameHeader.style.border = "solid";
    nameHeader.style.borderWidth = "1px";
    nameHeader.style.textAlign = "center";
    headRow.appendChild(nameHeader);

    var repsHeader = document.createElement("th");
    repsHeader.textContent = "Number of Reps";
    repsHeader.style.border = "solid";
    repsHeader.style.borderWidth = "1px";
    repsHeader.style.textAlign = "center";
    headRow.appendChild(repsHeader);

    var weightHeader = document.createElement("th");
    weightHeader.textContent = "Weight Used";
    weightHeader.style.border = "solid";
    weightHeader.style.borderWidth = "1px";
    weightHeader.style.textAlign = "center";
    headRow.appendChild(weightHeader);

    var dateHeader = document.createElement("th");
    dateHeader.textContent = "Date Performed";
    dateHeader.style.border = "solid";
    dateHeader.style.borderWidth = "1px";
    dateHeader.style.textAlign = "center";
    headRow.appendChild(dateHeader);

    var lbsHeader = document.createElement("th");
    lbsHeader.textContent = "Unit";
    lbsHeader.style.border = "solid";
    lbsHeader.style.borderWidth = "1px";
    lbsHeader.style.textAlign = "center";
    headRow.appendChild(lbsHeader);


    newTable.appendChild(headRow);


    // Now populate the table with the results returned from the database
    for(var index = 0; index < newData.length; index++){
        var newRow = document.createElement("tr");

        var nameCell = document.createElement("td");
        nameCell.textContent = newData[index].name;
        nameCell.style.border = "solid";
        nameCell.style.borderWidth = "1px";
        nameCell.style.textAlign = "center";
        newRow.appendChild(nameCell);

        var repsCell = document.createElement("td");
        repsCell.textContent = newData[index].reps;
        repsCell.style.border = "solid";
        repsCell.style.borderWidth = "1px";
        repsCell.style.textAlign = "center";
        newRow.appendChild(repsCell);

        var weightCell = document.createElement("td");
        weightCell.textContent = newData[index].weight;
        weightCell.style.border = "solid";
        weightCell.style.borderWidth = "1px";
        weightCell.style.textAlign = "center";
        newRow.appendChild(weightCell);

        var dateCell = document.createElement("td");
        dateCell.textContent = newData[index].date;
        dateCell.style.border = "solid";
        dateCell.style.borderWidth = "1px";
        dateCell.style.textAlign = "center";
        newRow.appendChild(dateCell);

        var lbsCell = document.createElement("td");
        if(newData[index].lbs == 1) {
            lbsCell.textContent = "lbs";
        }

        else {
            lbsCell.textContent = "kg";
        }

        lbsCell.style.border = "solid";
        lbsCell.style.borderWidth = "1px";
        lbsCell.style.textAlign = "center";
        newRow.appendChild(lbsCell);

        // Store the id for the row in a hidden input

        var deleteContainer = document.createElement("td");
        var deleteForm = document.createElement("form");
        deleteForm.method="post";                                   // Need to specify the form's action on next line
        deleteForm.action="";

        var hiddenDeleteId = document.createElement("input");
        hiddenDeleteId.type="hidden";
        hiddenDeleteId.className="hiddenId";                  // Used to determine which row will be deleted
        hiddenDeleteId.name="id";
        hiddenDeleteId.value = newData[index].id;   // Store the id within the form
        deleteForm.appendChild(hiddenDeleteId);

        // Form submits only the id of the row to the given page

        var deleteButton = document.createElement("input");
        deleteButton.type="submit";
        deleteButton.name="deleteButton";
        deleteButton.value="Delete";
        deleteButton.className="deleteButton";
        deleteForm.appendChild(deleteButton);
        deleteContainer.appendChild(deleteForm);
        newRow.appendChild(deleteContainer);

        var updateContainer = document.createElement("td");     // Code to create an edit button that submits row id to server
        var updateForm = document.createElement("form");
        updateForm.method = "post";
        updateForm.action = "";
        var hiddenUpdateId = document.createElement("input");
        hiddenUpdateId.type = "hidden";
        hiddenUpdateId.className = "updateId";
        hiddenUpdateId.name = "id";
        hiddenUpdateId.value = newData[index].id;     // Store the row id within the form
        updateForm.appendChild(hiddenUpdateId);

        var updateButton = document.createElement("input");
        updateButton.type = "submit";
        updateButton.name = "updateButton";
        updateButton.value = "Edit";
        updateButton.className = "updateButton";
        updateForm.appendChild(updateButton);
        updateContainer.appendChild(updateForm);
        newRow.appendChild(updateContainer);


        newTable.appendChild(newRow);
    }

    document.getElementById("tableToBeConstructed").appendChild(newTable);
};

document.addEventListener("DOMContentLoaded",function(){
    var req = new XMLHttpRequest();
    req.open("GET", "http://flip2.engr.oregonstate.edu:5840/?generateTable=1", true);
    req.addEventListener("load", function(){
        if (req.status >= 200 && req.status < 400) {
            //console.log("GET Request Worked");
            var dataTable = JSON.parse(req.responseText);
            displayTable(dataTable);
            bindDeleteButtons();
        }

        else {
            console.log("Get Request Failed");
        }
    });

    req.send(null);

});



document.getElementById('addExerciseButton').addEventListener("click", function(event){
    //console.log("POST Event Listener Simple Method Worked!");
    var req = new XMLHttpRequest();
    // Get all of the user input information

    var dataToSend = {};
    dataToSend.name = document.getElementById('name').value;
    dataToSend.reps = document.getElementById('reps').value;
    dataToSend.weight = document.getElementById('weight').value;
    dataToSend.date = document.getElementById('date').value;
    dataToSend.lbs = document.getElementById('lbs').value;
    dataToSend.addExerciseButton = document.getElementById('addExerciseButton').value;



    req.open("POST", "http://flip2.engr.oregonstate.edu:22420/", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener("load", function(){
        if (req.status >= 200 && req.status < 400) {
            //console.log("POST Request Worked");
            //console.log(req.responseText);


            var newData = JSON.parse(req.responseText);

            // if user forgot to include the name of the exercise an error will occur

            if(newData.badInput){
                alert("You need to input the name of the exercise to add a row to the table. Try again.");
            }

            else{
                displayTable(newData);
                bindDeleteButtons();
            }

        }

        else {
            console.log("POST Request Failed");
        }
    });

    req.send(JSON.stringify(dataToSend));

    event.preventDefault();
});


function bindDeleteButtons(){
    //console.log("Bind delete buttons was started");
    var deleteButtonList = document.getElementsByClassName("deleteButton"); // List of all form submit buttons that will send id to server
    var hiddenIdList = document.getElementsByClassName("hiddenId");         // List of all hidden inputs that contain id as value


    for (var index = 0; index < deleteButtonList.length; index++){
        function closureWrapper(index) {
            deleteButtonList[index].addEventListener("click", function(event){

                var req = new XMLHttpRequest();
                var dataToSend = {};
                req.open("POST", "http://flip2.engr.oregonstate.edu:5840/", true);
                req.setRequestHeader('Content-Type', 'application/json');

                dataToSend.id = hiddenIdList[index].value;
                dataToSend.deleteButton = "Delete";

                //console.log(index);

                req.addEventListener('load', function(){
                    if(req.status >= 200 && req.status < 400){
                        var newData = JSON.parse(req.responseText);
                        displayTable(newData);
                        bindDeleteButtons();
                    }

                    else {
                        console.log("Error in network request: " + req.statusText);
                    }
                });

                req.send(JSON.stringify(dataToSend));
                event.preventDefault();
            });
        }closureWrapper(index);    // wrapper function called here to create closure
    };
}