const WinningBid = require('../../models/winningBidModel');
const Product = require('../../models/productModel');
const User = require('../../models/userModel');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

/**
 * Get bidding sales income statistics for admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getBiddingSalesIncome = async (req, res) => {
  const { format } = req.query;

  try {
    // Fetch all winning bids
    const winningBids = await WinningBid.find()
      .populate('productID')
      .populate('userID')
      .exec();

    // Map data into structured format
    const salesData = winningBids.map(wb => ({
      id: wb._id,
      productName: wb.productID?.productName || 'Unknown',
      brandName: wb.productID?.brandName || 'Unknown',
      bidAmount: wb.bidAmount,
      closeDate: wb.closeDate,
      buyerName: wb.userID?.name || 'Unknown',
      buyerEmail: wb.userID?.email || 'Unknown',
    }));

    // Calculate total income
    const totalIncome = salesData.reduce((sum, item) => sum + item.bidAmount, 0);

    // Generate response based on requested format
    if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 50 });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="bidding_sales_income_report.pdf"');

      doc.pipe(res);

      // Title
      doc.fontSize(20).text('Bidding Sales Income Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(`Date Generated: ${new Date().toLocaleDateString()}`, { align: 'left' });
      doc.fontSize(14).text(`Total Income: $${totalIncome.toFixed(2)}`, { align: 'left' });
      doc.moveDown(2);

      // Table header
      const tableTop = doc.y;
      doc.font('Helvetica-Bold');
      doc.fontSize(10);
      doc.text('Product', 50, tableTop);
      doc.text('Brand', 150, tableTop);
      doc.text('Bid Amount', 250, tableTop);
      doc.text('Close Date', 330, tableTop);
      doc.text('Buyer', 420, tableTop);

      doc.moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke();

      // Table rows
      let rowTop = tableTop + 25;
      doc.font('Helvetica');

      const checkPageBreak = (y) => {
        if (y > 700) {
          doc.addPage();
          return 50;
        }
        return y;
      };

      salesData.forEach(item => {
        rowTop = checkPageBreak(rowTop);

        doc.fontSize(10).text(item.productName.substring(0, 20), 50, rowTop);
        doc.text(item.brandName.substring(0, 20), 150, rowTop);
        doc.text(`$${item.bidAmount.toFixed(2)}`, 250, rowTop);
        doc.text(new Date(item.closeDate).toLocaleDateString(), 330, rowTop);
        doc.text(item.buyerName.substring(0, 20), 420, rowTop);

        rowTop += 20;
      });

      doc.end();
    } else if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Bidding Sales Income');

      // Headers
      worksheet.columns = [
        { header: 'Product Name', key: 'productName', width: 30 },
        { header: 'Brand Name', key: 'brandName', width: 20 },
        { header: 'Bid Amount ($)', key: 'bidAmount', width: 15 },
        { header: 'Close Date', key: 'closeDate', width: 20 },
        { header: 'Buyer Name', key: 'buyerName', width: 25 },
        { header: 'Buyer Email', key: 'buyerEmail', width: 30 },
      ];

      // Data rows
      salesData.forEach(item => {
        worksheet.addRow({
          productName: item.productName,
          brandName: item.brandName,
          bidAmount: item.bidAmount,
          closeDate: new Date(item.closeDate).toLocaleDateString(),
          buyerName: item.buyerName,
          buyerEmail: item.buyerEmail,
        });
      });

      // Total Income Row
      worksheet.addRow({});
      worksheet.addRow({ productName: 'Total Income', bidAmount: totalIncome });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="bidding_sales_income_report.xlsx"');

      await workbook.xlsx.write(res);
      res.end();
    } else {
      // Default JSON response
      res.status(200).json({
        totalIncome,
        salesData
      });
    }
  } catch (error) {
    console.error('Error generating bidding sales income report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getBiddingSalesIncome
};
