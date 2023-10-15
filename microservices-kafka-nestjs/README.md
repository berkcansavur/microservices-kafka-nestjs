# microservices-kafka-nestjs
Microservices Banking Project
This project is an example of a microservices architecture for a banking application. It incorporates technologies such as NestJS, Kafka, MongoDB, and Node.js. Below, you will find information about the overall structure of the project and details about each microservice.

Technologies
NestJS: A modern, modular Node.js web framework is used.
Kafka: Used for event-driven microservices communication.
MongoDB: Used as the database.
Node.js: Used for fast and efficient execution.
General Information
The project adopts a microservices architecture. Each microservice focuses on its own area of responsibility and communicates with others through Kafka. Brief descriptions of each microservice are provided below:

accounts: Handles operations related to account creation and management.
api-gateway: Receives HTTP requests and directs them to the relevant microservices.
banks: Manages bank and customer-related operations.
transfers: Manages transfer creation and management operations.
Banking Application Features
Basic operations like creating, deleting, and updating accounts can be performed.
Bank and customer information can be managed.
Transfer creation and approval operations can be performed.
Adopts an event-driven architecture through Kafka.
How to Run
Please refer to the README.md file in each microservice's directory for detailed instructions on running the application. Note that Kafka server and Java must be installed and configured in the environment for the application to work correctly.