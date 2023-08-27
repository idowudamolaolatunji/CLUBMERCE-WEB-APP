const User = require('../model/usersModel');
const Transaction = require('../model/transactionModel');
const verifyPayment = require('../utils/verifyPayment');


// verify transaction
// exports.verifyPaystackPayment = async function(req, _) {
//     try {
//         const { reference, type } = req.params;
//         const paymentVerfification = await verifyPayment(reference);
//         const [booValue, response] = paymentVerfification;
//     } catch(err) {
//         console.log(err)
//     }
// }


// get one transaction by admin
exports.getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if(transaction < 1) return res.json({message: 'No transactions found'})
    
        res.status(200).json({
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
        if(!transactions) return res.json({ message: 'No transactions has been made by any user' })
    
        res.status(200).json({
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
        const { bankAccount, amount } = req.body;
        
        // Perform necessary validations and checks
        const user = await User.findById(req.user._id);
        if (!bankAccount || !amount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has enough
        if(user.wallet < 0) return res.json({ message: 'insuficienct ballance' });
        if(amount > 10000 && user.wallet >= amount) return res.json({ message: 'Minimul withdrawal is 10,000' });

        // Make a transfer request to the company payment API
        const transferResponse = await axios.post('/transfer', {
            bankAccount,
            amount
        });
    
        // Handle the transfer API response
        if (transferResponse.status === 200) {
            const { transactionId } = transferResponse.data;
    
            // Create a new transaction for the transfer
            const transaction = await Transaction.create({
                transactionId,
                user: user._id,
                amount,
                createdAt: this.formattedCreatedAt
            });
    
            res.status(201).json({
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
  
// Get all transactions for and by a specific user
exports.getAllTransactionByUser = async (req, res) => {
    try {
        const { userId } = req.user._id;
        if(!userId) return res.status(400).json({ message: 'No user with that ID' })
    
        // Retrieve the transaction for the user
        const transactions = await Transaction.find({ _id: userId });
        if(transactions < 1) return res.json({message: 'You do not have any transactions'})
    
        res.status(400).json({
            status: 'success',
            data: {
                transactions
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}