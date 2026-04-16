import express from "express";
import { getCompanies, getCompanyDetails } from "../controllers/companyController.js";

const router = express.Router();

router.get("/", getCompanies);
router.get("/:name", getCompanyDetails);

export default router;
