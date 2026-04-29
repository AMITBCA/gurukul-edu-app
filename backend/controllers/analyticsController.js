const Fee = require('../models/Fee');
const Test = require('../models/Test');
const Attendance = require('../models/Attendance');
const Batch = require('../models/Batch');

// @desc    Get comprehensive analytics data for Admin Dashboard
// @route   GET /api/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res) => {
    try {
        // 1. REVENUE TRENDS (Fees collected over the last 6 months)
        // We aggregate the paymentHistory arrays from all fees
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1); // Start of that month

        const revenueDataRaw = await Fee.aggregate([
            { $unwind: "$paymentHistory" },
            { $match: { "paymentHistory.date": { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        month: { $month: "$paymentHistory.date" },
                        year: { $year: "$paymentHistory.date" }
                    },
                    totalRevenue: { $sum: "$paymentHistory.amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const revenueTrends = revenueDataRaw.map(item => ({
            month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
            revenue: item.totalRevenue
        }));

        // Fee Summary (Expected vs Collected)
        const feeSummaryRaw = await Fee.aggregate([
            {
                $group: {
                    _id: null,
                    totalExpected: { $sum: "$totalAmount" },
                    totalCollected: { $sum: "$amountPaid" }
                }
            }
        ]);
        const feeSummary = feeSummaryRaw.length > 0 ? {
            expected: feeSummaryRaw[0].totalExpected,
            collected: feeSummaryRaw[0].totalCollected,
            pending: feeSummaryRaw[0].totalExpected - feeSummaryRaw[0].totalCollected
        } : { expected: 0, collected: 0, pending: 0 };


        // 2. BATCH PERFORMANCE (Average scores)
        const tests = await Test.find().populate('batchId', 'name');
        const batchPerformanceMap = {};

        tests.forEach(test => {
            if (!test.batchId) return;
            const batchName = test.batchId.name;
            
            if (test.results && test.results.length > 0) {
                const totalScored = test.results.reduce((acc, curr) => acc + curr.marksObtained, 0);
                const avgScore = totalScored / test.results.length;
                const percentage = (avgScore / test.totalMarks) * 100;

                if (!batchPerformanceMap[batchName]) {
                    batchPerformanceMap[batchName] = { totalPercentage: 0, count: 0 };
                }
                batchPerformanceMap[batchName].totalPercentage += percentage;
                batchPerformanceMap[batchName].count += 1;
            }
        });

        const batchPerformance = Object.keys(batchPerformanceMap).map(batch => ({
            batch,
            averageScore: Math.round(batchPerformanceMap[batch].totalPercentage / batchPerformanceMap[batch].count)
        }));


        // 3. ATTENDANCE STATISTICS (Overall present vs absent rates)
        const attendanceStatsRaw = await Attendance.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const attendanceStats = attendanceStatsRaw.map(stat => ({
            name: stat._id,
            value: stat.count
        }));

        res.json({
            success: true,
            data: {
                revenueTrends,
                feeSummary,
                batchPerformance,
                attendanceStats
            }
        });

    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
