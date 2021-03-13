var express = require('express');
var mysql = require('./dbcred.js');
var bodyParser = require('body-parser'); //to handle post requests

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3009);

app.use(express.static('public'));

// allows parsing of requests sent to this server from a client
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* Handles Data sent from client and inserts in db */
app.post('/insert',function(req,res,next){
  var context = {};
  var postParameters = [];

  postParameters.push(req.body)

  mysql.pool.query('INSERT INTO workouts SET ?', postParameters, function(err,result){
    if(err){
      next(err);
      return;
    }

    mysql.pool.query('SELECT * FROM workouts ORDER BY id ASC LIMIT 1',function(err,rows,fields){
      if(err){
        next(err);
        return;
      }

      // save rows in an array
      context.workouts = rows[0];
      console.log("db sending back to server", context);
      res.send(JSON.stringify(context));
    });
  });
});

app.get('/',function(req,res,next){

  var context = {};
  var exerciseList = [];
  // see if this is messing things up later..
  mysql.pool.query('SELECT * FROM workouts ORDER BY id DESC LIMIT 1',function(err,rows,fields){
    if(err){
      next(err);
      return;
    }

    // save rows in an array
    context.workouts = rows[0];
    res.render('home');
  });
});

// route to select all from table
app.get('/select-all', function(req,res,next){
  mysql.pool.query('SELECT * FROM workouts',function(err,rows,fields){
    if(err){
      next(err);
      return;
    }
    res.send(JSON.stringify(rows));
  });
});

app.get('/update-row', function(req,res,next){

  var context = {};

  console.log(req.query.id);
  console.log("get exercise with this id", req.query.id)
  mysql.pool.query('SELECT * FROM workouts WHERE id=?', [req.query.id],
      function(err,rows,fields){
        if(err){
          next(err);
          return;
        }
        console.log("current row", rows[0]);
        context = rows[0];
        console.log("returned data from update2", context);
        res.render('update-row', context);
      })
});

app.get('/testForm', function(req,res,next){
  res.render('testForm');
});

app.post('/edit-row', function(request, response){
  console.log("query recieved", request.body.name);
  var context = {};
  mysql.pool.query('UPDATE `workouts` SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?', [request.body.name, request.body.reps, request.body.weight,
        request.body.date, request.body.lbs, request.body.id],
      function(err,result){
        if(err){
          next(err);
          return;
        }
        console.log("result", result);
        response.render('home');
      });
});

app.post('/delete-row', function(req,res,next ){

  console.log("delete row with this id", req.body.id);
  mysql.pool.query('DELETE FROM `workouts` WHERE id =?', [req.body.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT * FROM `workouts`', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      console.log("after deletion", rows);
    });
  });
});

/*Link to easily reset table*/
app.get('/reset-table',function(req,res,next){
  var context = {};
  //replace your connection pool with the your variable containing the connection pool
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
        "id INT PRIMARY KEY AUTO_INCREMENT,"+
        "name VARCHAR(255) NOT NULL,"+
        "reps INT,"+
        "weight INT,"+
        "date DATE,"+
        "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      res.render('home',context);
    })
  });
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
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});