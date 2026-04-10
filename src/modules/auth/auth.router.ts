import express, { Router } from "express";
import { riderController } from "../rider/rider.controller";

const router = express.Router();

router.post("/rider/signup", riderController.riderSignup);

export const customAuthRouter: Router = router;
 