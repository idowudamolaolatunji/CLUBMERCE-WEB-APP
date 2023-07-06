const app = require('../app');
const User = require('../model/userModel');
const Transaction = require('../model/transactionModel')


// Get all transactions for a specific user
exports.getTransaction = async (req, res) => {
    try {
        const { userId } = req.params;
        if(!userId) return res.status(400).json({ message: 'No user with that ID' })
    
        // Retrieve the transaction for the user
        const transaction = await Transaction.findById({ userId });
        if(transaction < 1) return res.json({message: 'You do not have any transactions'})
    
        res.status(400).json({
            status: 'success',
            data: {
                transaction
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
  
// Get all transactions for admin
exports.getAllTransactions = async (req, res) => {
    try {
        // Retrieve all transactions
        const transactions = await Transaction.find();
        if(!transactions) return res.json({ message: 'No transactions has been made by your users' })
    
        res.status(400).json({
            status: 'success',
            data: {
                transactions 
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
  

// Create a new transaction for transferring to a bank account
exports.makeTransferCreateTransaction = async (req, res) => {
    try {
        const { userId, bankAccount, amount, description } = req.body;
    
        // Perform necessary validations and checks
        if (!userId || !bankAccount || !amount) {
                return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ messaghe: 'User not found' });
        }

        // Check if the user has enough
        if(user.wallet < 0) return res.json({ message: 'insuficienct ballance' });
        if(amount > 10000 && user.wallet >= amount) return res.json({ message: 'Minimul withdrawal is 10,000' });

        // Make a transfer request to the company payment API
        const transferResponse = await axios.post('PAYMENT_API_ENDPOINT/transfer', {
            userId,
            bankAccount,
            amount,
        });
    
        // Handle the transfer API response
        if (transferResponse.status === 200) {
            const transactionId = transferResponse.data.transactionId;
    
            // Create a new transaction for the transfer
            const transaction = await Transaction.create({
            transactionId,
            user: userId,
            amount,
            });
    
            res.status(200).json({
                status: 'success',
                data: {
                    transaction
                }
            });
        } else {
            return res.status(500).json({ error: 'Transfer failed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
  