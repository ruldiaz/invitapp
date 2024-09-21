const User = require('../../models/User');
const Wedding = require('../../models/Wedding');

class WeddingController {
   // register new wedding sale for a user
   async register(req, res) {
    console.log('Incoming wedding registration data:', req.body);
    
    const { userId, designName, price, image, groomName, brideName, date, time } = req.body;
  
    if (!userId || !designName || !price || !image || !groomName || !brideName || !date || !time) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }
  
    try {
      // Verify if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
          code: 404
        });
      }
  
      // Create new invitation for the user
      const wedding = new Wedding({
        designName,
        price,
        image,
        groomName,
        brideName,
        date,
        time,
        userId,
        isPaid: false
      });
  
      await wedding.save();
      console.log('Wedding saved:', wedding);
  
      return res.status(201).json({
        status: 'success',
        data: wedding
      });
  
    } catch (error) {
      console.error('Error saving wedding:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to save wedding',
        code: 500
      });
    }
  }
  
    
}

module.exports = new WeddingController();