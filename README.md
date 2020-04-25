Udacity capstone is the final project in the [Udacity Cloud Developer Nanodegree](https://www.udacity.com/course/cloud-developer-nanodegree--nd9990))


## Prerequisites

The following tools will needed:  

-  [AWS](https://console.aws.amazon.com/) account

  

## 1. Install
  
  The project has the following structure folder:

 - Udacity Casptone
	 - backend
	 - frontend

  To install both parts of the app tu must be in the right folder, execute form root folder:
	

    cd backend
    npm i

.

    cd frontend
    npm i

  

## 2. Executing offine

This app works with [Serverless Framework](https://serverless.com/) and it is used to run the application offline with DynamoDB

Execute in the backend folder:

    sls dynamodb install
    sls dynamodb start // then you need to create the table from the browser at http://localhost:8000/shell
    sls offline -s local

  

## 3. Deploy
Be sure you have AWS credentias configured.

    sls deploy
