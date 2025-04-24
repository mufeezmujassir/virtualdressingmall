const Order = require('../../models/orderModel');
const Product = require('../../models/productModel');
const User = require('../../models/userModel');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

const getSellerIncomeReport = async (req, res) => {
  const { sellerId, startDate, endDate, format } = req.query;

  try {
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const sellerProducts = await Product.find({ ShopID: sellerId });
    const productIds = sellerProducts.map(product => product._id);

    const orders = await Order.find({
      productID: { $in: productIds },
      ...dateFilter
    })
      .populate('productID', 'productName ShopID')
      .populate('userID', 'name email');

    const results = orders.map(order => {
      const commissionPercent = order.productID?.commission || 10; // Default commission
      const commission = (order.TotalAmount * commissionPercent) / 100;
      const netIncome = order.TotalAmount - commission;

      return {
        productName: order.productID?.productName,
        orderQuantity: order.Quantity,
        totalAmount: order.TotalAmount,
        orderDate: order.createdAt,
        orderStatus: order.Status,
        customer: order.userID?.name || 'N/A',
        email: order.userID?.email || 'N/A',
        commission,
        netIncome
      };
    });

    if (format === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="order_income_report.pdf"');
      doc.pipe(res);

      doc.fontSize(16).text('Order Income Report', { align: 'center' });
      doc.moveDown();

      results.forEach(item => {
        doc.fontSize(12).text(`Product: ${item.productName}`);
        doc.text(`Quantity: ${item.orderQuantity}`);
        doc.text(`Total Amount: $${item.totalAmount}`);
        doc.text(`Net Income: $${item.netIncome}`);
        doc.text(`Commission: $${item.commission}`);
        doc.text(`Order Date: ${new Date(item.orderDate).toLocaleDateString()}`);
        doc.text(`Status: ${item.orderStatus}`);
        doc.text(`Customer: ${item.customer} (${item.email})`);
        doc.moveDown();
      });

      doc.end();
    } else if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Income Report');

      worksheet.columns = [
        { header: 'Product Name', key: 'productName', width: 20 },
        { header: 'Order Quantity', key: 'orderQuantity', width: 15 },
        { header: 'Total Amount', key: 'totalAmount', width: 15 },
        { header: 'Commission', key: 'commission', width: 15 },
        { header: 'Net Income', key: 'netIncome', width: 15 },
        { header: 'Order Date', key: 'orderDate', width: 20 },
        { header: 'Order Status', key: 'orderStatus', width: 15 },
        { header: 'Customer Name', key: 'customer', width: 20 },
        { header: 'Customer Email', key: 'email', width: 25 }
      ];

      worksheet.addRows(results);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="order_income_report.xlsx"');

      await workbook.xlsx.write(res);
      res.end();
    } else {
      return res.json({ success: true, data: results });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = getSellerIncomeReport;
