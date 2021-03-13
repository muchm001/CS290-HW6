document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
    document.getElementById('submit').addEventListener('click', function(event){

        var req = new XMLHttpRequest();
        var parms = 'name=';
        parms += document.getElementById('name').value;
        parms += '&reps=' + document.getElementById('reps').value;
        parms += '&weight=' + document.getElementById('weight').value;
        parms += '&date=' + document.getElementById('date').value;

        var checkBox = document.getElementById('lbs')
        console.log(checkBox.checked);
        if(checkBox.checked){
            parms += "&lbs=1";
        }
        else{
            parms += "&lbs=0";
        }
        //parms += '&lbs=' + document.getElementById('lbs').value;


        //Post newest entry to database
        req.open('POST', 'http://flip3.engr.oregonstate.edu:62619/insert', true);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                // Query database and get newest entry
                var req2 = new XMLHttpRequest();
                req2.open("GET", "http://flip3.engr.oregonstate.edu:62619/updatedTable", true);
                req2.addEventListener('load',function(){
                    if(req2.status >= 200 && req2.status < 400){

                        //Get newest record from database
                        var response = req2.responseText;
                        var response = JSON.parse(req2.responseText);
                        newEntry = response.results[response.results.length-1];
                        newID = response.results[response.results.length-1].id;

                        // Create a new row and add details of newest record
                        var newRow = document.createElement("tr");
                        newRow.id = newID;

                        var newRowDetailname = document.createElement("td");
                        newRowDetailname.textContent = newEntry.name;
                        newRow.appendChild(newRowDetailname);

                        var newRowDetailreps = document.createElement("td");
                        newRowDetailreps.textContent = newEntry.reps;
                        newRow.appendChild(newRowDetailreps);

                        var newRowDetailweight = document.createElement("td");
                        newRowDetailweight.textContent = newEntry.weight;
                        newRow.appendChild(newRowDetailweight);

                        var date = new Date(response.results[response.results.length-1].date);
                        var newRowDetaildate = document.createElement("td");
                        newRowDetaildate.textContent = date.getMonth()+1 + "-" + date.getDate() + "-" + date.getFullYear();
                        newRow.appendChild(newRowDetaildate);

                        var newRowDetaillbs = document.createElement("td");
                        if (response.results[response.results.length-1].lbs === 0){
                            newRowDetaillbs.textContent = "kgs";
                        } else {
                            newRowDetaillbs.textContent = "lbs";
                        }
                        newRow.appendChild(newRowDetaillbs);

                        //Create edit button for new record
                        var newRowDetailEdit = document.createElement("td");
                        var editButton = document.createElement("input");
                        editButton.id = "edit2";
                        editButton.type = "button";
                        editButton.value = "Edit";
                        var connectString = "'/update?id="+ newID + "'"
                        editButton.setAttribute('onclick', "window.location.href=" + connectString);
                        newRowDetailEdit.appendChild(editButton);
                        newRow.appendChild(newRowDetailEdit);

                        //Create delete button for new record
                        var newRowDetailDelete = document.createElement("td");
                        var deleteButton = document.createElement("input");
                        deleteButton.id = "delete";
                        deleteButton.type = "button";
                        deleteButton.value = "Delete";
                        deleteButton.setAttribute('onclick',"deleteRow("+newID+")");

                        newRowDetailDelete.appendChild(deleteButton);
                        newRow.appendChild(newRowDetailDelete);

                        // Append new row with buttons to existing table
                        document.getElementById("table").appendChild(newRow);

                        event.preventDefault();
                    } else {
                        console.log("Error in network request: " + req2.statusText);
                    }});
                req2.send(null);
                event.preventDefault();
            } else {
                console.log("Error in network request: " + req.statusText);
            }});
        req.send(parms);
        event.preventDefault();
    })
};

// delete function assigned to every delete button
function deleteRow(id){
    var req = new XMLHttpRequest();
    var parms = 'id=';
    parms += id;

    var el = document.getElementById(id);
    el.remove();

    req.open("GET", "http://flip3.engr.oregonstate.edu:62619/delete?"+parms, true);
    req.send(null);
    event.preventDefault();
}
	