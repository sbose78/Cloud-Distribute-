/* This is the supreme controller 
  
  1) It accepts the job from the user
  2) Queries database to find the appropriate controller.
  3) Inserts job in the database.
  4) send job_id to controller and waits for solution

*/


var http = require('http');
var sendData = require('./sendPost');


var b='';


var databaseUrl = "sbose78:ECDW=19YRS@staff.mongohq.com:10068/BOSE"; // "username:password@example.com/mydb"
var collections = [ "controllers", "workers","users"]
var db = require("mongojs").connect(databaseUrl, collections); 

var get_worker = function(my_operation,callback)
{          
    
     // db.controllers.find({operation : '+'});
        db.workers.find( {operation : my_operation , busy : 0 }, function( err,docs){
            //if( err ) console.log("error!!");
            if(!docs || err )
            {
               console.log(my_operation+ "not found!");
               callback({ host: '-1' , port : '-1' });
          }

            else
            {
                console.log(' \n\n FOUND WORKER AT '+ docs[0].host + ':' +docs[0].port+ '\n\n');
                callback({ host: docs[0].host , port : docs[0].port}) ;
            }
        });
};


var update_worker_status = function(my_host, my_port , status , callback) {

        var is_updated = 1;
        db.workers.update({host: my_host , port : my_port }, {$set: {busy : status }}, function(err, updated) {

                    if( err || !updated ) 
                    {  
                        console.log("UPDATE FAILED");
                        is_updated = 0;
                        callback(is_updated);
                    } 
                    else{ 
                        console.log("UPDATED Busy/in-use status of "+my_host+":"+my_port  ) ;
                        callback(is_updated);
                    }
        });

}





http.createServer(function (req, res) {
 
 // query database and find out appropriate worker 

            req.on('data', function (data) {
                      b += data;
             });
            req.on('end', function () {

                       var operation = (JSON.parse(b)).operation ;
                       console.log( operation);

                       // query available worker

                       console.log( "getting worker");

                       get_worker( operation.toString(), function(host_object){
                              if( host_object.host != -1 )
                              {

                                  update_worker_status(host_object.host,host_object.port,1,function(update_status){

                                    // forward job to the worker.
                                          console.log(b + " \n\n   will be sent to \n\n "+ JSON.stringify(host_object) );
                                          sendData.post(host_object.host ,'/',host_object.port, JSON.parse(b) , function(body){  
                                           //body is in JSON  and will contain the results.

                                                  update_worker_status(host_object.host,host_object.port,0,function(update_status){
                                                      console.log("Released lock from worker ");
                                                  })  ;

                                                  console.log(" \n\n\n The solution --- \n\n"+body);                                      
                                                  res.writeHead(200, {'Content-Type': 'application/json'});
                                                  res.end(body);

                                          });
                                  });
                             }
                       });
                      //query database to get a worker.
            });

        //    req.end();


}).listen(4001, '127.0.0.1');

console.log('Server running at http://127.0.0.1:4001/');