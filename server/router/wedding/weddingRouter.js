const express = require('express');
const weddingController = require('../../controllers/wedding/weddingController');

class WeddingRouter {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/', (req, res, next) => {
      console.log('Post request to /api/weddings received');
      next();
    }, weddingController.register);
  }
}

module.exports = new WeddingRouter().router;
