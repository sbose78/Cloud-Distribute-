
Supreme controller:

1)finds out appropriate controller
	- queries database
	- adds job to the database. gets job_id

2)sends job as HTTP Post to appropriate controller.

{
	job_id : 2232
}

	- waits for response.

Controller:

3) Controller decides which worker to assign the job
	- queries database.
4) sends job as HTTP Post to appropriate worker.
{ 
	job_id : 2232
}

	- waits for response.


Worker:

5) Grabs JSON from HTTP request.
6) computes solution.

7) sends back solution to (4).
{
	job_id: 2234
	solution: 4
}



8)   (4)  sends back solution to (2)
{
	job_id: 2234
	solution: 4
}


9) Supreme controller updates database.

10) Displays result.


