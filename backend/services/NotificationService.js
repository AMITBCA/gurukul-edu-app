const sendEmail = require('../utils/sendEmail');

class NotificationService {
    /**
     * Helper to send notifications via preferred channels (Email for now).
     * WhatsApp / SMS integrations can be plugged in here later.
     */
    static async notify(user, subject, message, htmlMessage = null) {
        if (!user || !user.email) return;

        try {
            await sendEmail({
                email: user.email,
                subject: subject,
                message: message,
                html: htmlMessage || message
            });
            // console.log(`Notification sent to ${user.email} - Subject: ${subject}`);
        } catch (error) {
            console.error(`Failed to send notification to ${user.email}:`, error.message);
        }
    }

    /**
     * Triggered when a student is marked Absent
     */
    static async sendAbsentAlert(student, batchName, date) {
        const formattedDate = new Date(date).toLocaleDateString();
        const subject = `Absent Alert - ${batchName}`;
        const message = `Dear ${student.name},\n\nYou have been marked ABSENT for ${batchName} on ${formattedDate}.\n\nConsistent attendance is key to academic success. Please ensure you attend the upcoming classes.\n\nRegards,\nGurukul Excellence`;
        
        await this.notify(student, subject, message);
    }

    /**
     * Triggered automatically by a cron job for upcoming or overdue fees
     */
    static async sendFeeReminder(student, fee, type) {
        // type: 'upcoming', 'overdue'
        const dueDate = new Date(fee.dueDate).toLocaleDateString();
        const pendingAmount = fee.totalAmount - fee.amountPaid;
        
        let subject = '';
        let message = '';

        if (type === 'upcoming') {
            subject = `Fee Due Reminder - Action Required`;
            message = `Dear ${student.name},\n\nFriendly reminder that your fee payment of ₹${pendingAmount} is due on ${dueDate}.\n\nPlease arrange for payment to avoid any late fees or disruptions.\n\nRegards,\nGurukul Excellence`;
        } else if (type === 'overdue') {
            subject = `URGENT: Fee Overdue Notice`;
            message = `Dear ${student.name},\n\nYour fee payment of ₹${pendingAmount} was due on ${dueDate} and is now OVERDUE.\n\nPlease complete the payment immediately.\n\nRegards,\nGurukul Excellence`;
        }

        if(subject) await this.notify(student, subject, message);
    }

    /**
     * Triggered when new test results are published
     */
    static async sendTestResultAlert(student, testName, marksObtained, totalMarks) {
        const percentage = ((marksObtained / totalMarks) * 100).toFixed(2);
        const subject = `Test Results Published: ${testName}`;
        const message = `Dear ${student.name},\n\nResults for "${testName}" have been published.\n\nYou scored: ${marksObtained} / ${totalMarks} (${percentage}%).\n\nCheck your student portal for detailed performance analytics.\n\nRegards,\nGurukul Excellence`;
        
        await this.notify(student, subject, message);
    }
}

module.exports = NotificationService;
