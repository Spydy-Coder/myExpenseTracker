const Expense = require("../Models/Expense");
const ExpenseRequest = require("../Models/ExpenseRequest");

const saveExpense = async (req, res) => {
  try {
    const { tripId, category, description, totalMoney, issuedBy, members } =
      req.body;

    // Iterate over each member to create or update their document
    const operations = members.map((member) => {
      const expenseEntry = {
        category: category || "General", // Use 'General' as default category
        amount: member.amount, // Member's specific amount
        desc: description || "", // Use empty string if no description
        issued_by: issuedBy, // ID of the person who issued the expense
      };

      return Expense.findOneAndUpdate(
        {
          user_id: member.userId, // Match by userId
          trip_id: tripId, // Match by tripId
        },
        {
          $push: { expenses: expenseEntry }, // Add the new expense to the `expenses` array
        },
        {
          upsert: true, // Create a new document if none exists
          new: true, // Return the updated document
          setDefaultsOnInsert: true, // Set default values for schema fields if creating
        }
      );
    });

    // Execute all operations concurrently
    const results = await Promise.all(operations);

    res.status(200).json({
      message: "Expenses saved successfully!",
      data: results,
    });
  } catch (error) {
    console.error("Error saving expenses:", error);
    res.status(500).json({ message: "Error saving expenses", error });
  }
};

const getExpensesByTripAndUser = async (req, res) => {
  try {
    const { tripId, userId } = req.params;

    // Find all expenses for the given tripId and userId
    const expensesData = await Expense.find({
      trip_id: tripId,
      "expenses.issued_by": userId,
    }).populate("user_id", "username email");

    // Initialize the response object
    const userExpenses = {};

    // Iterate through all expense documents
    expensesData.forEach((doc) => {
      // Assuming that the `user_id` field is populated properly and is always available
      const userIdKey = doc.user_id._id.toString(); // Convert ObjectId to string
      if (!userExpenses[userIdKey]) {
        // Initialize user entry
        userExpenses[userIdKey] = {
          userDetails: {
            id: doc.user_id._id,
            name: doc.user_id.username,
            email: doc.user_id.email,
          },
          expenses: [],
        };
      }

      // Filter expenses where issued_by matches the given userId
      const filteredExpenses = doc.expenses.filter(
        (expense) => expense.issued_by.toString() === userId
      );

      // Only add filtered expenses if there are any matching ones
      if (filteredExpenses.length > 0) {
        userExpenses[userIdKey].expenses.push(...filteredExpenses);
      }
    });

    // Only return users that have expenses for this trip
    const filteredUserExpenses = Object.values(userExpenses).filter(
      (user) => user.expenses.length > 0
    );

    res.status(200).json({
      message: "Expenses fetched successfully",
      data: filteredUserExpenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Error fetching expenses", error });
  }
};

const saveExpenseRequest = async (req, res) => {
    try {
      const { trip_id, total_money, expenses, user_id, payee } = req.body;
  
      // Validate the request body
      if (
        !trip_id ||
        !user_id ||
        !expenses ||
        !payee ||
        !Array.isArray(expenses)
      ) {
        return res.status(400).json({ message: "Invalid request data" });
      }

  
      // Perform a single upsert operation for the entire expenses array
      const result = await ExpenseRequest.findOneAndUpdate(
        {
          user_id: user_id, // Match by user_id
          trip_id: trip_id, // Match by trip_id
          payee:payee
        },
        {
          $set: { 
            expenses: expenses, // Update expenses
            total_money,        // Update total money
          },
        },
        {
          upsert: true, // Create a new document if none exists
          new: true, // Return the updated document
          setDefaultsOnInsert: true, // Set default values for schema fields if creating
        }
      );
  
      res.status(200).json({
        message: "Expenses Request saved successfully!",
        data: result,
      });
    } catch (error) {
      console.error("Error saving expenses request:", error);
      res.status(500).json({ message: "Error saving expenses request", error });
    }
  };
  

const getExpensesRequestByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find all expenses for the given userId, populate payee and trip_id details
      const expensesData = await ExpenseRequest.find({ user_id: userId })
        .populate("payee", "id username") // Populate payee's username
        .populate("trip_id", "uniqueId tripName"); // Populate trip name
  
      res.status(200).json({
        message: "Expenses Request fetched successfully",
        data: expensesData,
      });
    } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({ message: "Error fetching expenses", error });
    }
  };

  // Sample route in your backend
  const saveMarkExpensesPaid = async (req, res) => {
    const { expenses, currentUserId, payee, trip_id } = req.body;
  
    try {
      for (const expense of expenses) {
   
        // Perform the update
        const result = await Expense.updateOne(
          {
            user_id: currentUserId, // Match user ID
            trip_id: trip_id, // Match trip ID
        
            "expenses._id": expense._id, // Match the specific expense by its _id
          },
          {
            $set: {
              "expenses.$.paid": true, // Update paid to true
            },
          }
        );

        const resultRequest = await ExpenseRequest.updateOne(
            {
              user_id: currentUserId, // Match user ID
              trip_id: trip_id, // Match trip ID
              payee: payee._id,
          
              "expenses._id": expense._id, // Match the specific expense by its _id
            },
            {
              $set: {
                "expenses.$.paid": true, // Update paid to true
              },
            }
          );
    
      }
  
      res.status(200).json({ message: "Expenses marked as paid" });
    } catch (error) {
      console.error("Error marking expenses as paid:", error);
      res.status(500).json({ message: "Error marking expenses as paid", error });
    }
  };
  
  
  

module.exports = {
  saveExpense,
  getExpensesByTripAndUser,
  saveExpenseRequest,
  getExpensesRequestByUser,
  saveMarkExpensesPaid
};
