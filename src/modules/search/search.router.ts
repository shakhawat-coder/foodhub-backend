import express, { Router } from "express";
import { aiSearch } from "./search.controller";

const router = express.Router();

router.post("/", aiSearch);

export const searchRouter: Router = router;
