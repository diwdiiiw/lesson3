var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

var app = express();
var db;

var mdbUrl = "mongodb://diwdiiiw:diwtrick1221@ds159998.mlab.com:59998/coen3464-t13"
MongoClient.connect("mongodb://diwdiiiw:diwtrick1221@ds159998.mlab.com:59998/coen3464-t13", function(err, database) {
    if (err) {
        console.log(err)
        return;
    }

    console.log("Connected to DB!");

    // set database
    db = database;

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', index);

    app.get('/students', function(req, res) {
        var studentsCollection = db.collection('students');
        studentsCollection.find().toArray(function(err, students) {
           console.log('students loaded', students);
          res.render('students', {
            students: students
          });
        })

    });

    app.post('/students', function(req, res) {
        console.log(req.body);
        var dataToSave = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
        };
        db.collection('students')
          .save(dataToSave, function(err, student) {
            if (err) {
                console.log('Saving Data Failed!');
                return;
            }
            console.log("Saving Data Successfull!");
            res.redirect('/students');
        })
    });

    app.get('/student/:studentId', function(req, res) {
        var studentId = req.params.studentId;
        var studentCollection = db.collection('students');
        studentCollection.findOne({ _id: new ObjectId(studentId) }, function(err, student) {
            res.render('student', {
                student: student
            });
        });
    });

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handler
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
});





module.exports = app;
