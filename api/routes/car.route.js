import express from "express";
import { airportToHotelCarOffers, carOffers } from "../controllers/car.controller.js";

const router = express.Router();

router.post('/car-offers', carOffers);
router.post('/airport-hotel-car-offers', airportToHotelCarOffers);

export default router;