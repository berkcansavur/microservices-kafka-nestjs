# Microservices Banking Project

In the real world, data consistency is critical in banking and similar industries. In these sectors, the consistency of transactions, data accessibility and effective measures against possible data interruptions must be successfully managed. While this microservice project ensures data continuity using Kafka, it also focuses on consistency and continuity targets with design patterns appropriate to the need, through the maintained state logic and process controls.

# Project Basic Principles
- Data Continuity is Provided with Kafka: In the project, data continuity is ensured by using the Kafka messaging system. This enables fast and reliable communication between microservices.

- Design Patterns for Consistency and Continuity: The project aims for consistency and continuity with design patterns appropriate to the need. These patterns are used to increase data consistency and ensure the reliability of transactions.

- CAP Theorem and Priorities: The project was considered in the context of the CAP theorem and transaction accuracy and consistency between microservices were prioritized instead of accessibility, especially in the banking sector.

- Kafka Partition Structure: Kafka's partition structure strengthens partitional precision and consistency mechanisms with state logic by providing operations specific to topics. In this way, it minimizes the possibility of data interruption between microservices.

This project is an example of a microservices architecture for a banking application, utilizing NestJS, Kafka, MongoDB, and Node.js.

## Technologies

- NestJS: A modern, modular Node.js web framework.
- Kafka: Event-driven microservices communication.
- MongoDB: Database storage.
- Node.js: Fast and efficient execution.
- Docker: A platform for simplifying application development, collaboration, and deployment across different platforms and users. It ensures consistent and reproducible environments for your application.

## General Information

The project follows a microservices architecture, with each microservice focused on specific responsibilities and communication handled through Kafka. Below are brief descriptions of each microservice:

- **accounts**: Manages account creation and management operations.
- **api-gateway**: Receives HTTP requests and directs them to relevant microservices.
- **banks**: Handles bank and customer-related operations.
- **transfers**: Manages transfer creation and approval operations.

## Banking Application Features

- Perform basic operations like creating, deleting, and updating accounts.
- Manage bank and customer information.
- Execute transfer creation and approval operations.
- Adopt an event-driven architecture through Kafka.

## How to Run

Refer to the README.md file in each microservice's directory for detailed instructions on running the application. Ensure that Kafka server and Java are installed and correctly configured in the environment for the application to work.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository.
3. Go to your main directory and type docker-compose up -d and hit enter in terminal.
4. To stop and remove docker containers that run type docker-compose down and hit enter in terminal.

Feel free to reach out for any issues or questions.

Happy coding!
