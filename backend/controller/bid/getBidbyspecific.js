const Bid=require('../../models/bidModel')

const getBidbyspecific=async(req,res)=>{
    try {
        const bids = await Bid.find()
          .populate('productID')
          .populate('bidder.userID')
          .exec();
    
        if (bids.length > 0) {
          return res.json({ success: true, data: bids });
        } else {
          return res.status(404).json({ success: false, message: 'No bids found' });
        }
      } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
}

module.exports=getBidbyspecific
