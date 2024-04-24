# Zod
This project utilizes the [Zod](https://zod.dev/) library.     

Zod is a schema declaration and validation library that integrates with TypeScript. 
It is used to define and validate the shape of data, such as the data received from an API, user input, or data that is to be stored in a database. 
It ensures that the data is in the correct format and makes the code safer and easier to work with.

## Data validation
Zod is used to validate data, ensuring it matches the expected format before it's processed. 
This is particularly useful when dealing with user input or data from external sources, where there's a risk of receiving malformed or unexpected data. 
The ```.refine``` is a method that is used to add additional validation rules to the schema. 
For instance when checking that a number is an integer or that a string is a valid email address.
