/* This is the worker
  
  1) It accepts the job from the controller
  2) computes solution
  3) Inserts job solution in the database. 
  4) sends { job_id , solution } back to the controller as response

*/


var http = require('http');
var sendData = require('./sendPost');


var job = {

  job_id: '2232'	

};

var controller = 'sbose78.iriscouch.com' ;

http.createServer(function (req, res) {
 
 // query database and find out appropriate worker 

        var b='';
           
        req.on('data', function (data) {
            b += data;
        });
        req.on('end', function () {

           console.log(b);
            // use POST

            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end("JOB DONE!");

        });

}).listen(1440, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1440/');