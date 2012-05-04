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


  var databaseUrl = "sbose78:ECDW=19YRS@staff.mongohq.com:10068/BOSE"; // "username:password@example.com/mydb"
  var collections = [ "reports", "controllers","users"]
  var db = require("mongojs").connect(databaseUrl, collections); 


var controller = function(my_operation)
{          console.log("in the variable :-o ");
    
     // db.controllers.find({operation : '+'});
        db.controllers.find( {operation : my_operation }, function( err,docs){
            if( err ) console.log("error!!");

            else if(!docs)
            {
                console.log("not found!");

            }

            else
            {
                console.log(docs[0].host + ':' +docs[0].port);
            }

            /*
            else users.forEach( function(femaleUser) {
              console.log(femaleUser);
            } );
          */
        });
    // docs is an array of all the documents in mycollection
};



http.createServer(function (req, res) {
 
   controller('+');

 // query database and find out appropriate worker 
  sendData.post('127.0.0.1','/','1440',
  		function(body)
  		{  
  		   //body is in JSON	
  			//console.log(JSON.stringify(body));


     
     

  	    res.writeHead(200, {'Content-Type': 'text/plain'});
		    res.end(body);
  		}
  );
}).listen(1441, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1441/');