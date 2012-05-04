/* This is the worker
  
  1) It accepts the job from the controller
  2) computes solution
  3) Inserts job solution in the database. 
  4) sends { job_id , solution } back to the controller as response

*/


var http = require('http');
var sendData = require('./sendPost');

var b='';


var insert_solution_into_database = function(solution,callback)
{
      var databaseUrl = "sbose78:ECDW=19YRS@staff.mongohq.com:10068/BOSE"; // "username:password@example.com/mydb"
      var collections = [ "users","controllers","jobs"];
      var db = require("mongojs").connect(databaseUrl, collections);  

      db.jobs.save(solution, function(err, saved) {
          if( err || !saved ) 
          {
                console.log("JOB "+JSON.stringify(solution)+ " COULD NOT BE saved \n\n");
                callback(0)
          }        
          else
          {
                console.log(" JOB "+JSON.stringify(solution)+ " saved");
                callback(1)
          } 
      });
};


http.createServer(function (req, res) {
 
                 req.on('data', function (data) {
                                      b += data;
                 });
                 req.on('end', function () {

                             var operationa = (JSON.parse(b)).operation ;
                             var ida = (JSON.parse(b)).id  ;

                             // query available worker

                             var operand1a = (JSON.parse(b)).operand1;
                             var operand2a = (JSON.parse(b)).operand2;
                             var solutiona = operand1a + operand2a ;

                             var solution_object =
                             {
                                id : ida,
                                operation : operationa ,
                                operand1 : operand1a ,
                                operand2 : operand2a ,
                                solution : solutiona ,
                             };

                             console.log("SOLUTION is:  "+ solutiona );
                             //body is in JSON  and will contain the results.

                             var response_object;
                            insert_solution_into_database(solution_object,function(status)
                            {
                                    if(status==1)
                                    { 
                                             response_object=
                                            {
                                                _id: ida,
                                                solution: solutiona,
                                                status: 1
                                            }
                                    }
                                    else
                                    {
                                            response_object=
                                            {
                                                _id: -1,
                                                solution: -1,
                                                status: 0
                                            }
                                    }
                                    res.writeHead(200, {'Content-Type': 'application/json'});
                                    res.end(JSON.stringify(response_object));
                            });
                       }); 

                 //req.end();

                      //query database to get a worker.
}).listen(4011, '127.0.0.1');

console.log('Server running at http://127.0.0.1:4011/');