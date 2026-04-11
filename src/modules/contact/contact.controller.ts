import { Request, Response } from "express";
import { contactService } from "./contact.service";


const createContact = async (req: Request, res: Response) => {
  try {
    const contact = await contactService.createContact(req.body);
    res.status(201).json({
      success: true,
      message: "Contact message sent successfully",
      data: contact,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send contact message",
    });
  }
}
const getAllContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await contactService.getAllContacts();
    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch contact messages",
    });
  }
}
export const contactController = {
  createContact,
  getAllContacts,
};
