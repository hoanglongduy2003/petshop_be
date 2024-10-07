import { Router } from "express";
import { createDeliveryAddress, getDeliveryAddressUser } from "../controllers/deliveryAddress";
const router = Router();

router.get("/deliveryAddressUser/:id", getDeliveryAddressUser);
router.post("/deliveryAddress", createDeliveryAddress);

export default router;
