const Commissions = require('../model/commissionModel')

// get all commission, something for only admins
exports.getAllCommission = async (req, res) => {
    try {
        const commissions = await Commissions.find().sort({ createdAt: -1});
        
        res.status(200).json({
            status: 'success',
            count: commissions.length,
            data: {
                commissions,
            }
        });
    } catch(err) {
        res.status(500).json({
            status: 'fail',
            message: 'Internal server error'
        })
    }
}