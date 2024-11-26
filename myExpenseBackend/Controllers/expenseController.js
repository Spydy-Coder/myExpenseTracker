const Expense = require("../Models/Expense");

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

    // Find all expenses for the given tripId
    const expensesData = await Expense.find({ trip_id: tripId }).populate(
      "user_id",
      "username email"
    );

    // Initialize the response object
    const userExpenses = {};

    // Iterate through all expense documents
    expensesData.forEach((doc) => {
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

      // Add the filtered expenses to the user's list
      userExpenses[userIdKey].expenses.push(...filteredExpenses);
    });

    res.status(200).json({
      message: "Expenses fetched successfully",
      data: userExpenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Error fetching expenses", error });
  }
};

module.exports = { saveExpense, getExpensesByTripAndUser };
