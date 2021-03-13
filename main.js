// Michael Childress
// Database Interactions and UI

var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host : 'classmysql.engr.oregonstate.edu',
  user : 'cs290_uchmanom',
  password : '8326',
  database : 'cs290_uchmanom',
  dateStrings : 'date'
});

module.exports.pool = pool;

app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 21420);

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.get('/', function(req, res, next){
  var context = {};
  
  //console.log("GET Request Received By Server!");
  
  if(req.query.generateTable){  // This will handle get request sent from client side after page first rendered
  
    mysql.pool.query('SELECT id, name, reps, weight, date_format(date,"%m-%d-%Y") AS date, lbs FROM workouts', function(err, rows, fields){
      if (err){
        next(err);
        return;
      }
      
      res.send(JSON.stringify(rows));
    
    });
    
  }
  
  else{
    res.render('home');
  }
  
});

app.post('/', function(req,res,next){
  var context = {};
  //context.results = "You've sent a POST request";
  
  //console.log("POST Request Received By Server!");
  //console.log(req.body);
  
  if(req.body.addExerciseButton){   // We came in from the add exercise form so need to add a row to the database table
    // if user didn't enter a first name, we don't want to add it to the table
    if(req.body.name == ""){
      var sendError = {badInput: true};
      res.send(JSON.stringify(sendError));
      return;
    }
    
    mysql.pool.query('INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (?,?,?,?,?)', [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs], function(err, result){
        if (err) {
            next(err);
            return;
        }
      
        else {
            mysql.pool.query('SELECT id, name, reps, weight, date_format(date,"%m-%d-%Y") AS date, lbs FROM workouts', function (err, rows, fields) {
                if (err) {
                    next(err);
                    return;
                }

                else {
                  res.send(JSON.stringify(rows));
                }
            });
        }
        
    });
  }
    
  else if(req.body.deleteButton){     // We're coming in from the delete button so need to remove a row
    mysql.pool.query('DELETE FROM workouts WHERE id = ?', [req.body.id], function(err, result) {
      if (err) {
        next(err);
        return;
      }
      
      else {
        mysql.pool.query('SELECT id, name, reps, weight, date_format(date,"%m-%d-%Y") AS date, lbs FROM workouts', function (err, rows, fields) {
          if (err) {
            next(err);
            return;
          }
          
          else {
            res.send(JSON.stringify(rows));
          }
          
        });
      }
      
    });
  }
  
  else if(req.body.updateButton) {      // User entered from the edit button. need to alter current page to show update form
    
    // Select all info in the row user wants to update
    mysql.pool.query('SELECT * FROM workouts WHERE id = ?', [req.body.id], function(err, rows, fields) {
      if (err) {
        next(err);
        return;
      }
      
      else {
        context.updateForm = true;
        context.id = rows[0].id;
        context.name = rows[0].name;
        context.reps = rows[0].reps;
        context.weight = rows[0].weight;
        context.date = rows[0].date;
        
        if(rows[0].lbs == 1) {
          context.lbsUsed = true;
        }
        
        res.render('home', context);
      }
      
    });
    
  }
  
  else if(req.body.updateExerciseButton) {      // user has submitted the update exercise form
    
    // if user deleted the exercise name, this should not be allowed. Display an error message
    
    if(req.body.name == ""){
      context.errorResults = "Update FAILED: All rows must contain at least an exercise name. Try again!";
      res.render('home',context);
      return;
    }
    
    mysql.pool.query('UPDATE workouts SET name = ?, reps = ?, weight = ?, date = ?, lbs = ? WHERE id = ?', [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs, req.body.id], function(err, result) {
      if(err) {
       next(err);
       return;
      }
      
      else {
        res.render('home');
        
      }
      
    });
  }
  
   
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://flip2.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
