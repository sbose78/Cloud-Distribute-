/* This is the supreme controller 
  
  1) It accepts the job from the user
  2) Queries database to find the appropriate controller.
  3) Inserts job in the database.
  4) send job_id to controller and waits for solution

*/


var http = require('http');
var sendData = require('./sendPost');
var databaseUrl = "sbose78:ECDW=19YRS@staff.mongohq.com:10068/BOSE"; // "username:password@example.com/mydb"
var collections = [ "reports", "controllers","users"]
var db = require("mongojs").connect(databaseUrl, collections); 
var my_operation = '+';


var job = {

	_id : db.bson.ObjectID.createPk(), 
	operand1 : 2 ,
	operand2 : 3 ,
	operation :  my_operation,
	solution : 1,
	worker_id : '0'
};

var controller = function(my_operation,callback)
{          
    
     // db.controllers.find({operation : '+'});
        db.controllers.find( {operation : my_operation }, function( err,docs){
            //if( err ) console.log("error!!");
            if(!docs || err )
            {
            	 console.log("not found!");
            	 callback({ host: '-1' , port : '-1' });
        	}

            else
            {
                console.log('\n\n FOUND CONTROLLER  '+docs[0].host + ':' +docs[0].port + '\n\n');
                callback({ host: docs[0].host , port : docs[0].port}) ;
            }
        });
};




http.createServer(function (req, res) {
 
 // query database and find out appropriate controller 

 //insert job into db

  controller('+',function(host_object){

  		  var my_host= host_object.host;
  		  var my_port= host_object.port;

  		//  console.log("INSIDE THE CALLBACK I CREATED: "+my_host+':'+my_port);
      		// forward the job to the controller  		  
      		  sendData.post(my_host,'/',my_port, job , 
      		  		function(body)
      		  		{  
      		  		   //body is in JSON	
      		  			console.log(" \n\n\n  The solution --- \n"+body);
      		  			res.writeHead(200, {'Content-Type': 'application/json'});
      		  			res.end(body);
      		  		}
		        );
		 
  });
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');