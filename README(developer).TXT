
Supreme controller:

1)finds out appropriate controller
	- queries database
	- gets an auto-generated job_id

2)sends job as HTTP Post to appropriate controller.

var job = {

	_id : db.bson.ObjectID.createPk(), 
	operand1 : 2 ,
	operand2 : 3 ,
	operation :  my_operation,
	solution : 1,
};

	- waits for response.


Controller:

3) Controller decides which worker to assign the job
	- queries database.

4) sends job as HTTP Post to appropriate worker.


var job = {

	_id : db.bson.ObjectID.createPk(), 
	operand1 : 2 ,
	operand2 : 3 ,
	operation :  my_operation,
	solution : 1,
};

	- waits for response.


Worker:

5) Grabs JSON from HTTP request.
6) computes solution.

8) Updates database.

sends back solution to (4).

{
	job_id: 2234
	solution: 4
	status: 1
}



9)   Now (4)  sends back solution to (2)

{
	job_id: 2234
	solution: 4
	status: 1
}



10) Displays result.


