# Microservices Banking Project

This project is an example of a microservices architecture for a banking application, utilizing NestJS, Kafka, MongoDB, and Node.js.

## Technologies

- NestJS: A modern, modular Node.js web framework.
- Kafka: Event-driven microservices communication.
- MongoDB: Database storage.
- Node.js: Fast and efficient execution.

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
2. Navigate to each microservice's directory and follow the instructions in their respective README.md files.
3. Install and configure Kafka server and Java in your environment.

Feel free to reach out for any issues or questions.

Happy coding!
