# NestJS GraphQL Analytics

This project is a NestJS application that implements GraphQL queries for calculating and analyzing data from various REST services. It focuses on generating business metrics and statistics, calculating Key Performance Indicators (KPIs), implementing temporal comparisons, and creating analytical reports.

## Project Structure

- **src/**: Contains the main application code.
  - **main.ts**: Entry point of the application.
  - **app.module.ts**: Root module that imports necessary modules.
  - **app.service.ts**: Application-wide services.
  - **rest-clients/**: Contains clients for communicating with REST services.
    - **recetas.client.ts**: Client for recetas REST service.
    - **medicos.client.ts**: Client for medicos REST service.
    - **pacientes.client.ts**: Client for pacientes REST service.
  - **analytics/**: Contains analytics-related functionality.
    - **analytics.module.ts**: Module for analytics.
    - **analytics.service.ts**: Business logic for analytics.
    - **analytics.resolver.ts**: GraphQL resolver for analytics queries.
    - **dto/**: Data Transfer Objects for input validation.
    - **types/**: GraphQL types for analytics results.
  - **common/**: Contains common utilities and decorators.
    - **decorators/**: Custom decorators for documentation.
    - **utils/**: Utility functions for data aggregation.
  - **graphql/**: Custom GraphQL scalars.
    - **scalars/**: Custom scalar types.

## Features

- **GraphQL Queries**: The application provides several GraphQL queries that allow users to analyze data across multiple entities.
- **KPI Calculation**: Users can calculate KPIs based on input parameters and time ranges.
- **Trend Analysis**: The application supports trend analysis over specified time periods.
- **Analytical Reports**: Users can generate detailed analytical reports based on aggregated data.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd nest-graphql-analytics
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the application:
   ```
   npm run start
   ```

## Usage

Once the application is running, you can access the GraphQL playground at `http://localhost:3000/graphql` to explore the available queries and mutations.

## Documentation

Each GraphQL query and type is documented using the `@Description` decorator, providing clear insights into their purpose and usage.

## Testing

End-to-end tests are included in the `test/analytics.e2e-spec.ts` file to ensure the functionality of the analytics module.

## License

This project is licensed under the MIT License.