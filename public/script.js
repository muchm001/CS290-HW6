document.addEventListener('DOMContentLoaded', bindButtons(event));


function bindButtons(event) {
    alert("Loaded buttons");

    viewLog(event);
    document.getElementById('wSubmit').addEventListener('click', function(event) {
        alert("clicked");
        addWorkout(event);
        viewLog(event);
    });
}


function addWorkout(event) {
    //Base URL for 'insert' request
    var url = 'http://52.24.243.214:3000/insert?';

    //Get workout Name
    var name = document.getElementById('wName').value;
    console.log("Name: " + name);
    if (name === '') {
        name = undefined;
    }
    else {
        // Add workout if not blank
        url = url + 'name=' + name + '&';
    }
    console.log("Name after: " + name);

    //Get workout Reps
    var reps = document.getElementById('wReps').value;
    console.log("Reps: " + reps);
    if (reps === '') {
        reps = undefined;

    }
    else {
        // Add reps if not blank
        url = url + 'reps=' + reps + '&';
    }
    console.log("Reps after: " + reps);

    //Get workout weight
    var weight = document.getElementById('wWeight').value;
    console.log("Weight: " + weight);
    if (weight === '') {
        weight = undefined;
    }
    else {
        // Add weight if not blank
        url = url + 'weight=' + weight + '&';
    }
    console.log("Weight after: " + weight);

    //Get workout date
    var date = document.getElementById('wDate').value;
    console.log("Date before: " + date);
    if (date === '') {
        date = undefined;
    }
    else {
        // Add date if not blank
        url = url + 'date=' + date + '&';
    }
    console.log("Date after: " + date);

    //Get workout units (pound or kilogram)
    var lbs = document.getElementById('wlbs').checked;
    var kgs = document.getElementById('wkgs').checked;
    console.log("Pounds before: " + lbs);
    if (lbs === true) {
        // Add workout in pounds
        console.log("in pounds");
        lbs = 1;
        url = url + 'lbs=' + lbs;
    }
    else if (kgs === true ) {
        // Add workout in kilograms
        console.log("in kgs");
        lbs = 0;
        url = url + 'lbs=' + lbs;
    }
    else {
        console.log("unit not selected");
        lbs = undefined;
    }
    console.log("Pounds after: " + lbs);

    console.log("Url: " + url);

    var insert = new XMLHttpRequest();
    insert.open('GET', url, true);

    insert.addEventListener('load', function() {
        if(insert.status >= 200 && insert.status < 400) {
            console.log("Insertion successful");
        }
        else {
            console.log("Error in network request: " + insert.statusText);
        }
    });
    insert.send(null);
    event.preventDefault();



}

function viewLog(event){

    var req = new XMLHttpRequest();
    req.open('GET', 'http://52.24.243.214:3000/view', true);

    req.addEventListener('load', function() {
        if(req.status >= 200 && req.status < 400){
            var response = JSON.parse(req.responseText);
            console.log(response);


            var removeMe = document.getElementById('tbody');
            if (removeMe != null) {
                var parent = removeMe.parentNode;
                parent.removeChild(removeMe);
            }

            var tb = document.getElementById('tableLog');
            var tbody = document.createElement('tbody');
            tbody.setAttribute("id", "tbody");


            tb.appendChild(tbody);

            for (var i in response) {

                var newRow = document.createElement('tr');
                var e1 = document.createElement('td');
                var e2 = document.createElement('td');
                var e3 = document.createElement('td');
                var e4 = document.createElement('td');
                var e5 = document.createElement('td');
                var e6 = document.createElement('td');

                var nameText = document.createTextNode(response[i].name);
                var repsText = document.createTextNode(response[i].reps);
                var weightText = document.createTextNode(response[i].weight);
                var dateText = document.createTextNode(response[i].date);
                var lbsText = document.createTextNode(response[i].lbs);


                var editButton = document.createElement('input');
                editButton.setAttribute("type", "button");
                editButton.setAttribute("value", "edit");

                var deleteButton = document.createElement('input');
                deleteButton.setAttribute("type", "button");
                deleteButton.setAttribute("value", "delete");
                deleteButton.setAttribute("onclick", "deleteRow");

                var hidden = document.createElement('form');
                hidden.setAttribute("type", "hidden");
                hidden.setAttribute("value", response[i].id);

                var hidden2 = document.createElement('form');
                hidden2.setAttribute("type", "hidden");
                hidden2.setAttribute("value", response[i].id);

                deleteButton.setAttribute("onclick", "deleteRow(this)");
                editButton.setAttribute("onclick", "editRow(this)");
                editButton.appendChild(hidden2);
                deleteButton.appendChild(hidden);

                // Append new row information to existing table
                tbody.appendChild(newRow);

                newRow.appendChild(e1);
                e1.appendChild(nameText);

                newRow.appendChild(e2);
                e2.appendChild(repsText);

                newRow.appendChild(e3);
                e3.appendChild(weightText);

                newRow.appendChild(e4);
                e4.appendChild(dateText);

                newRow.appendChild(e5);
                e5.appendChild(lbsText);

                newRow.appendChild(e6);
                e6.appendChild(editButton);
                e6.appendChild(deleteButton);


                console.log("Name " + response[i].name + "\n");
                console.log("Reps " + response[i].reps + "\n");
                console.log("Weight " + response[i].weight + "\n");
                console.log("Date " + response[i].date + "\n");
                console.log("Lbs " + response[i].lbs + "\n");




            }



        }
        else {
            console.log("Error in network request: " + req.statusText);
        }
    });
    req.send(null);
    //event.preventDefault();
}

function deleteRow(element) {

    var item = element.firstChild;
    var idVal = item.getAttribute("value");

    console.log("Item with id " + idVal + " will be deleted");

    var url = 'http://52.24.243.214:3000/delete?id=' + idVal;
    var req = new XMLHttpRequest();

    req.open('GET', url, true);

    req.addEventListener('load', function(){
        if(req.status >= 200 && req.status < 400){
            console.log("Deletion successful");
        }
        else {
            console.log("Server Error: " + req.statusText);
        }
    });
    req.send(null);

    viewLog();

}

function editRow(element){

    var item = element.firstChild;
    var idVal = item.getAttribute("value");

    console.log("Item with id " + idVal + " will be edited");

    // Get row information prior to edit
    var url =  'http://52.24.243.214:3000/one' + "?id=" + idVal;
    console.log("Edit url is: " + url);

    var req = new XMLHttpRequest();
    req.open('GET', url , true);

    req.addEventListener('load', function() {
        if(req.status >= 200 && req.status < 400){
            console.log("View for edit successful");
            var response = JSON.parse(req.responseText);
            console.log(response);

        }




        else {
            console.log("Error in network request: " + req.statusText);
        }
    });
    req.send(null);
    //event.preventDefault();
}
