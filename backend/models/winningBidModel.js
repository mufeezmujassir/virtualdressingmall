const mongoose = require('mongoose');

const winningBidSchema = new mongoose.Schema({
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  },
  shopID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  winningAmount: Number,
  closeDate: Date,
}, {
  timestamps: true
});

const WinningBid = mongoose.model('winningBid', winningBidSchema);
module.exports = WinningBid;