const Reservation = require('../../models/reservationModel');
const Product = require('../../models/productModel');
const User = require('../../models/userModel');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

const getReservations = async (req, res) => {
  const { productID, userID, status, startDate, endDate, format } = req.query;

  try {
    // Build filter object
    const filter = {};

    if (productID) {
      filter.productID = productID;
    }
    if (userID) {
      filter.userID = userID;
    }
    if (status) {
      filter.ValidateReservation = status;
    }
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(`${endDate}T23:59:59.999Z`)
      };
    }

    // Fetch reservations with populated user and product info
    const reservations = await Reservation.find(filter)
      .populate('productID', 'productName brandName category')
      .populate('userID', 'name email');

    // If export is requested
    if (format === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="reservations_report.pdf"');
      doc.pipe(res);

      doc.fontSize(20).text('Reservation Report', { align: 'center' });
      doc.moveDown();
      if (startDate && endDate) {
        doc.fontSize(14).text(`Date Range: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`, { align: 'center' });
        doc.moveDown(2);
      }

      doc.fontSize(12);
      reservations.forEach((reservation, index) => {
        doc.text(`Reservation #${index + 1}`, { underline: true });
        doc.text(`Product: ${reservation.productID?.productName || 'N/A'}`);
        doc.text(`Brand: ${reservation.productID?.brandName || 'N/A'}`);
        doc.text(`User: ${reservation.userID?.name || 'N/A'}`);
        doc.text(`Email: ${reservation.userID?.email || 'N/A'}`);
        doc.text(`Size: ${reservation.size}`);
        doc.text(`Quantity: ${reservation.Quantity}`);
        doc.text(`Status: ${reservation.ValidateReservation || 'Pending'}`);
        doc.text(`Reservation Date: ${reservation.ReservationDate}`);
        doc.moveDown();
      });

      doc.end();
      return;
    }

    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Reservations');

      worksheet.columns = [
        { header: 'Reservation ID', key: 'id', width: 25 },
        { header: 'Product Name', key: 'productName', width: 20 },
        { header: 'Brand', key: 'brandName', width: 20 },
        { header: 'User Name', key: 'userName', width: 20 },
        { header: 'User Email', key: 'userEmail', width: 25 },
        { header: 'Size', key: 'size', width: 10 },
        { header: 'Quantity', key: 'quantity', width: 10 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Reservation Date', key: 'reservationDate', width: 20 },
      ];

      reservations.forEach(reservation => {
        worksheet.addRow({
          id: reservation.ReservationID,
          productName: reservation.productID?.productName || 'N/A',
          brandName: reservation.productID?.brandName || 'N/A',
          userName: reservation.userID?.name || 'N/A',
          userEmail: reservation.userID?.email || 'N/A',
          size: reservation.size,
          quantity: reservation.Quantity,
          status: reservation.ValidateReservation || 'Pending',
          reservationDate: reservation.ReservationDate
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="reservations_report.xlsx"');

      await workbook.xlsx.write(res);
      res.end();
      return;
    }

    // Return normal JSON if no export
    res.json({ success: true, data: reservations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const validateReservation = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // status: 'Validated' or 'Rejected' or etc.

  try {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    reservation.ValidateReservation = status;
    await reservation.save();

    res.json({ success: true, message: 'Reservation status updated successfully', data: reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const markExpiredOrCompletedReservations = async (req, res) => {
  try {
    const currentDate = new Date();

    // Example logic: Reservations older than 30 days are expired
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);

    const expiredReservations = await Reservation.updateMany(
      { ReservationDate: { $lte: thirtyDaysAgo }, ValidateReservation: { $ne: 'Completed' } },
      { ValidateReservation: 'Expired' }
    );

    res.json({ success: true, message: 'Expired reservations updated successfully', data: expiredReservations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getReservations,
  validateReservation,
  markExpiredOrCompletedReservations
};
