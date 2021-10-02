
This project was developed as part of the Embedded Systems for the Internet of Things course at the University of Cagliari.

The aim of the project is to develop a device that controls a lock and enables its opening through a two-factor verification procedure.

The project is developed using the MEAN stack.

#Project organization 
It contains five main folders:
- bin: 
  this folder contains the scripts to configure and install the project in an EC2 instance 
-door_controller
  this folder contains the source code to be loaded into the board in order to simulate the port control. 
  It contains the 'libreries' folder, which contains the non-standard libraries used in code development.
-server
  this folder contains the code for the backend of the webapp. It contains the controllers, templates and routes used by the backend.
-src
  this directory contains the code for the frontend. Inside the subfolder 'app' it contains all components and services.
-testing
  this folder contains all the code for testing the functionality of the system. 
  Inside there is a folder 'ESIT-Testing' which contains the collections to populate the testing database with.


