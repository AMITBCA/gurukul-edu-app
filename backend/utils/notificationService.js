const sendEmail = require('./sendEmail');

const notificationService = {
    // 1. Absent Alert
    sendAbsentAlert: async (student, date, batchName) => {
        try {
            if (!student || !student.email) return;

            const formattedDate = new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            
            const message = `
            Dear ${student.name},\n
            We noticed that you were marked ABSENT for your ${batchName} class on ${formattedDate}.\n
            Consistent attendance is crucial for your success. Please ensure you catch up with the missed study materials on the Gurukul portal.\n
            If this is a mistake, please contact your class coordinator.\n
            Best Regards,
            Gurukul Excellence Team
            `;

            const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #4f46e5;">Attendance Alert</h2>
                <p>Dear <strong>${student.name}</strong>,</p>
                <p>We noticed that you were marked <span style="color: #e11d48; font-weight: bold;">ABSENT</span> for your <strong>${batchName}</strong> class on <strong>${formattedDate}</strong>.</p>
                <p>Consistent attendance is crucial for your success. Please ensure you catch up with the missed study materials on the <a href="${process.env.FRONTEND_URL}/student/materials" style="color: #4f46e5;">Gurukul portal</a>.</p>
                <p>If this is a mistake, please contact your class coordinator.</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="font-size: 12px; color: #6b7280;">Best Regards,<br>Gurukul Excellence Team</p>
            </div>
            `;

            await sendEmail({
                email: student.email,
                subject: 'Absence Alert - Gurukul Excellence',
                message,
                html
            });
        } catch (error) {
            console.error('Failed to send absent alert:', error.message);
        }
    },

    // 2. Fee Assigned Alert
    sendFeeAssignedAlert: async (student, amount, dueDate, batchName) => {
        try {
            if (!student || !student.email) return;

            const formattedDueDate = new Date(dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            
            const message = `
            Dear ${student.name},\n
            A new fee payment of Rs. ${amount} has been assigned to your account for the ${batchName} batch.\n
            Payment Deadline: ${formattedDueDate}\n
            Please ensure timely payment to avoid late fees. You can view your invoice details on the Gurukul portal.\n
            Best Regards,
            Gurukul Excellence Team
            `;

            const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #4f46e5;">New Fee Invoice Generated</h2>
                <p>Dear <strong>${student.name}</strong>,</p>
                <p>A new fee payment of <strong style="color: #16a34a;">₹${amount}</strong> has been assigned to your account for the <strong>${batchName}</strong> batch.</p>
                <p><strong>Payment Deadline:</strong> <span style="color: #e11d48;">${formattedDueDate}</span></p>
                <p>Please ensure timely payment. You can view your invoice details on the <a href="${process.env.FRONTEND_URL}/student/dashboard" style="color: #4f46e5;">Gurukul portal</a>.</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="font-size: 12px; color: #6b7280;">Best Regards,<br>Gurukul Excellence Team</p>
            </div>
            `;

            await sendEmail({
                email: student.email,
                subject: 'New Fee Invoice - Gurukul Excellence',
                message,
                html
            });
        } catch (error) {
            console.error('Failed to send fee alert:', error.message);
        }
    },

    // 3. Test Result Alert
    sendTestResultAlert: async (student, testName, marksObtained, totalMarks, messageFeedback) => {
        try {
            if (!student || !student.email) return;

            const percentage = ((marksObtained / totalMarks) * 100).toFixed(2);
            let performanceColor = percentage >= 75 ? '#16a34a' : (percentage >= 40 ? '#d97706' : '#e11d48');
            let performanceText = percentage >= 75 ? 'Excellent' : (percentage >= 40 ? 'Fair' : 'Needs Improvement');

            const message = `
            Dear ${student.name},\n
            The results for "${testName}" have been published.\n
            Score: ${marksObtained} / ${totalMarks} (${percentage}%)\n
            Feedback: ${messageFeedback || 'None'}\n
            Check your detailed analytics on the Gurukul portal.\n
            Best Regards,
            Gurukul Excellence Team
            `;

            const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #4f46e5;">Test Results Published</h2>
                <p>Dear <strong>${student.name}</strong>,</p>
                <p>The results for the recent test <strong>"${testName}"</strong> have been successfully evaluated.</p>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
                    <p style="margin: 0; font-size: 18px;">Score: <strong>${marksObtained}</strong> / ${totalMarks}</p>
                    <p style="margin: 5px 0 0 0; color: ${performanceColor}; font-weight: bold;">Performance: ${performanceText} (${percentage}%)</p>
                    ${messageFeedback ? `<p style="margin: 10px 0 0 0; font-size: 14px; font-style: italic;">Instructor Feedback: "${messageFeedback}"</p>` : ''}
                </div>
                <p>Check your detailed analytics on the <a href="${process.env.FRONTEND_URL}/student/dashboard" style="color: #4f46e5;">Gurukul portal</a>.</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="font-size: 12px; color: #6b7280;">Best Regards,<br>Gurukul Excellence Team</p>
            </div>
            `;

            await sendEmail({
                email: student.email,
                subject: `Test Results: ${testName} - Gurukul Excellence`,
                message,
                html
            });
        } catch (error) {
            console.error('Failed to send test result alert:', error.message);
        }
    }
};

module.exports = notificationService;
