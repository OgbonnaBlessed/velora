import express from "express";
import { carOffers } from "../controllers/car.controller.js";

const router = express.Router();

router.post('/car-offers', carOffers);

export default router;