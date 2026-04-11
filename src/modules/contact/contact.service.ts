import { prisma } from "../../lib/prisma";


const createContact = async (data: { name: string; email: string; subject: string; message: string }) => {
  return await prisma.contact.create({
    data,
  });
}
const getAllContacts = async () => {
  return await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });
}
export const contactService = {
  createContact,
  getAllContacts,
}; 
