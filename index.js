// Import necessary modules
let mongoose = require("mongoose");
require("dotenv").config(); // To load environment variables from the .env file
let { MongoClient } = require("mongodb"); // Import MongoClient to work with MongoDB directly

// Step 1: Set up MongoDB URI and create MongoClient
let uri = `mongodb+srv://jaydendejong83:${process.env.MONGO_DB_PASSWORD}@cluster0.kmw7t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a new MongoClient instance with the URI
let client = new MongoClient(uri);

// Step 2: Connect to MongoDB using Mongoose
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB via Mongoose"))
  .catch((err) =>
    console.log("Error connecting to MongoDB via Mongoose:", err)
  );

// Step 3: Define the Person Schema
let personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  favoriteFoods: { type: [String] },
});

// Step 4: Create a model using the schema
let Person = mongoose.model("Person", personSchema);

// Step 5: Create and Save a Single Record
let person = new Person({
  name: "John Doe",
  age: 25,
  favoriteFoods: ["Pizza", "Sushi"],
});

async function savePerson() {
  try {
    let savedPerson = await person.save();
    console.log("Person saved:", savedPerson);
  } catch (err) {
    console.error("Error saving person:", err);
  }
}

savePerson();

// Step 6: Create Many Records
let arrayOfPeople = [
  { name: "Alice", age: 30, favoriteFoods: ["Burritos", "Tacos"] },
  { name: "Bob", age: 35, favoriteFoods: ["Pasta", "Burgers"] },
];

async function createPeople() {
  try {
    let createdPeople = await Person.create(arrayOfPeople);
    console.log("Multiple people created:", createdPeople);
  } catch (err) {
    console.error("Error creating people:", err);
  }
}

createPeople();

// Step 7: Find People by Name
async function findPeopleByName() {
  try {
    let people = await Person.find({ name: "John Doe" });
    console.log("Found people:", people);
  } catch (err) {
    console.error("Error finding people:", err);
  }
}

findPeopleByName();

// Step 8: Find One Person by Favorite Food
async function findOnePersonByFood() {
  try {
    let person = await Person.findOne({ favoriteFoods: "Pizza" });
    console.log("Found person:", person);
  } catch (err) {
    console.error("Error finding person:", err);
  }
}

findOnePersonByFood();

// Step 9: Find a Person by ID
async function findPersonById(personId) {
  try {
    let person = await Person.findById(personId);
    console.log("Found person by ID:", person);
  } catch (err) {
    console.error("Error finding person by ID:", err);
  }
}

let personId = "insert_id_here"; // Replace with a real ID
findPersonById(personId);

// Step 10: Perform Classic Updates (Find, Edit, Save)
async function updatePerson(personId) {
  try {
    let person = await Person.findById(personId);
    if (person) {
      person.favoriteFoods.push("Hamburger"); // Add "Hamburger" to the favoriteFoods array
      let updatedPerson = await person.save();
      console.log("Updated person:", updatedPerson);
    } else {
      console.log("Person not found.");
    }
  } catch (err) {
    console.error("Error finding person to update:", err);
  }
}

updatePerson(personId);

// Step 11: Perform Updates Using findOneAndUpdate
async function updatePersonByName() {
  try {
    let updatedPerson = await Person.findOneAndUpdate(
      { name: "John Doe" },
      { age: 20 },
      { new: true }
    );
    console.log("Updated person:", updatedPerson);
  } catch (err) {
    console.error("Error updating person:", err);
  }
}

updatePersonByName();

// Step 12: Delete One Document Using findByIdAndRemove
async function deletePersonById(personId) {
  try {
    let removedPerson = await Person.findByIdAndRemove(personId);
    console.log("Removed person:", removedPerson);
  } catch (err) {
    console.error("Error removing person:", err);
  }
}

deletePersonById(personId);

// Step 13: Delete Many Documents Using remove
async function deletePeopleByName() {
  try {
    let result = await Person.deleteMany({ name: "Mary" });
    console.log("Number of people removed:", result.deletedCount);
  } catch (err) {
    console.error("Error removing people:", err);
  }
}

deletePeopleByName();

// Step 14: Chain Search Query Helpers to Narrow Search Results
async function findPeopleWithQuery() {
  try {
    let people = await Person.find({ favoriteFoods: "Burritos" })
      .sort({ name: 1 }) // Sort by name (ascending order)
      .limit(2) // Limit to 2 results
      .select("-age"); // Exclude the 'age' field from the result
    console.log("People who like burritos:", people);
  } catch (err) {
    console.error("Error finding people:", err);
  }
}

findPeopleWithQuery();

// Optional: Close the MongoDB connection when done (in case you want to disconnect)
client.close();
