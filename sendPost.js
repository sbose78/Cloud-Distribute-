exports.post=function(my_host,my_path,my_port,my_data,callback)
{
      console.log("Now sending \n\n " + JSON.stringify(my_data) + "\n\n to "+ my_host+":"+ my_port);
       var http=require('http');

       var options = 
       {
                host: my_host ,//'sbose78.iriscouch.com',
                path: my_path, //'/bosedb1',
                port: my_port,
                method: 'POST',

                headers:{
               'Content-Type':'application/json',
               'accept':'application/json'
                 }
         };

     
        var req = http.request(options, function(res) {
              /*
                     console.log('STATUS: ' + res.statusCode);
                     console.log('HEADERS: ' + JSON.stringify(res.headers));
              */
                     var body="";

                     res.on('data', function (chunk) {
                       body+=chunk;
               //        console.log('BODY(inside listener):\n ' );
                       callback(body); //sent back as JSON

                     });                   
            });


        req.on('error', function(e) {
          callback('problem with request: ' + e.message);
          console.log('problem with request: ' + e.message);
        });


        data=my_data;
         //write data to request body
        req.write(JSON.stringify(my_data));
        req.end();
}

