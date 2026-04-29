const PDFDocument = require('pdfkit');

const generateFeeReceipt = (res, feeDetails, paymentDetails, studentDetails) => {
    // Create document
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Pipe directly to the response
    doc.pipe(res);

    // --- Header ---
    doc
        .fillColor('#4f46e5') // Indigo-600
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('GURUKUL EXCELLENCE', 50, 50, { align: 'center', characterSpacing: 2 });

    doc
        .fillColor('#64748b') // Slate-500
        .fontSize(10)
        .font('Helvetica')
        .text('Over Sabarmati Gas office, Pavan City, 3rd floor, Sun arcade, D.P.Road, B/H, Modasa, Gujarat 383315', { align: 'center' })
        .moveDown(0.5);

    doc
        .fillColor('#475569') // Slate-600
        .text('Phone: +91 9909758566  |  Email: hsoni1443@gmail.com', { align: 'center' })
        .moveDown(2);

    // --- Receipt Title ---
    doc
        .fillColor('#1e293b') // Slate-800
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('FEE RECEIPT', { align: 'center', underline: true })
        .moveDown(2);

    // --- Receipt Details (Top Box) ---
    const receiptNo = `REC-${paymentDetails._id.toString().slice(-6).toUpperCase()}`;
    const date = new Date(paymentDetails.date).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    const currentYTopBox = doc.y;

    doc
        .fontSize(11)
        .font('Helvetica-Bold').text('Receipt No:', 50, currentYTopBox)
        .font('Helvetica').text(receiptNo, 120, currentYTopBox)
        
        .font('Helvetica-Bold').text('Date:', 380, currentYTopBox)
        .font('Helvetica').text(date, 420, currentYTopBox);
    
    doc.moveDown(2);

    // --- Student Details ---
    const studentY = doc.y;
    doc
        .fillColor('#4f46e5')
        .fontSize(14)
        .font('Helvetica-Bold').text('Student Information', 50, studentY)
        .moveTo(50, studentY + 20).lineTo(545, studentY + 20).strokeColor('#e2e8f0').lineWidth(1).stroke()
        .moveDown(1.5);
    
    doc.fillColor('#1e293b').fontSize(11);
    const infoYOffset = doc.y;

    doc
        .font('Helvetica-Bold').text('Name:', 50, infoYOffset)
        .font('Helvetica').text(`${studentDetails.name}`, 150, infoYOffset)
        
        .font('Helvetica-Bold').text('Batch:', 50, infoYOffset + 20)
        .font('Helvetica').text(`${feeDetails.batchId.name}`, 150, infoYOffset + 20)
        
        .font('Helvetica-Bold').text('Enrollment No:', 320, infoYOffset)
        .font('Helvetica').text(`${studentDetails.enrollmentNumber || 'N/A'}`, 410, infoYOffset);

    doc.moveDown(4);

    // --- Payment Details Section ---
    const paymentY = doc.y;
    doc
        .fillColor('#4f46e5')
        .fontSize(14)
        .font('Helvetica-Bold').text('Payment Details', 50, paymentY)
        .moveTo(50, paymentY + 20).lineTo(545, paymentY + 20).strokeColor('#e2e8f0').lineWidth(1).stroke()
        .moveDown(1.5);

    doc.fillColor('#1e293b').fontSize(11);

    // Helper to draw rows
    const drawRow = (label, value, yLine, isBold = false) => {
        if(isBold) doc.font('Helvetica-Bold'); else doc.font('Helvetica');
        doc.text(label, 50, yLine);
        
        if(isBold) doc.font('Helvetica-Bold'); else doc.font('Helvetica-Bold');
        doc.text(value, 395, yLine, { width: 150, align: 'right' });
    };

    let currentY = doc.y + 5;
    
    drawRow('Fee Amount / Installment Paid', `Rs. ${paymentDetails.amount.toLocaleString('en-IN')}`, currentY);
    currentY += 30;
    
    drawRow('Payment Method', paymentDetails.paymentMethod, currentY);
    currentY += 30;
    
    if (paymentDetails.transactionId) {
        drawRow('Transaction ID / Ref', paymentDetails.transactionId, currentY);
        currentY += 30;
    }

    if (paymentDetails.remarks) {
        drawRow('Remarks', paymentDetails.remarks, currentY);
        currentY += 30;
    }

    // Total Paid Line
    doc.moveTo(50, currentY + 5).lineTo(545, currentY + 5).strokeColor('#4f46e5').lineWidth(2).stroke();
    currentY += 20;

    doc.fontSize(14);
    drawRow('Total Amount Paid', `Rs. ${paymentDetails.amount.toLocaleString('en-IN')}`, currentY, true);

    // --- Status ---
    const remaining = feeDetails.totalAmount - feeDetails.amountPaid;
    currentY += 40;
    doc.fontSize(10).fillColor('#64748b').font('Helvetica');
    doc.text(`Fee Status: ${feeDetails.status}  |  Total Fee: Rs. ${feeDetails.totalAmount.toLocaleString('en-IN')}  |  Remaining Dues: Rs. ${(remaining > 0 ? remaining : 0).toLocaleString('en-IN')}`, 50, currentY, { align: 'center', width: 495 });

    // --- Signatures / Footer ---
    doc
        .fillColor('#1e293b')
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('Authorized Signatory', 400, 650, { align: 'right' });

    doc
        .fillColor('#94a3b8')
        .fontSize(9)
        .font('Helvetica')
        .text('This is a computer-generated receipt and does not require a physical signature.', 50, 720, { align: 'center', width: 495 })
        .text('Thank you for choosing Gurukul Excellence!', 50, 735, { align: 'center', width: 495 });

    doc.end();
};

module.exports = { generateFeeReceipt };
