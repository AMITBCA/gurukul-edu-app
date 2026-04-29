const cron = require('node-cron');
const Fee = require('../models/Fee');
const NotificationService = require('../services/NotificationService');

const initCronJobs = () => {
    // Run daily at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
        console.log('Running Daily Fee Check Cron Job...');
        try {
            // Find fees that are pending or overdue
            const pendingFees = await Fee.find({ status: { $ne: 'Paid' } }).populate('studentId');
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (const fee of pendingFees) {
                if (!fee.studentId) continue;

                const dueDate = new Date(fee.dueDate);
                dueDate.setHours(0, 0, 0, 0);

                const diffTime = dueDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                // Send upcoming reminder 3 days before due date
                if (diffDays === 3) {
                    await NotificationService.sendFeeReminder(fee.studentId, fee, 'upcoming');
                }
                
                // Send upcoming reminder 1 day before due date
                else if (diffDays === 1) {
                    await NotificationService.sendFeeReminder(fee.studentId, fee, 'upcoming');
                }
                
                // Send overdue notice if it is past due by 1, 7, or 14 days
                else if (diffDays === -1 || diffDays === -7 || diffDays === -14) {
                    await NotificationService.sendFeeReminder(fee.studentId, fee, 'overdue');
                }
            }
        } catch (error) {
            console.error('Error in Daily Fee Check Cron Job:', error);
        }
    });

    console.log('Cron Jobs Initialized successfully.');
};

module.exports = initCronJobs;
