import { Router } from "express";
import { contactController } from "./contact.controller";

const router = Router();

router.post("/", contactController.createContact);
router.get("/", contactController.getAllContacts);

export const contactRouter = router;
