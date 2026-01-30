import { Request, Response } from "express";
import { providerService } from "./provider.service";
const createProvider = async (req: Request, res: Response) => {
  try {
    const provider = await providerService.createProvider(req.body);
    res.status(201).json(provider);
  } catch (error) {
    res.status(500).json({ error: "Failed to create provider" });
  }
};
const createProvidersFromUsers = async (req: Request, res: Response) => {
  try {
    const providers = await providerService.createProvidersFromUsers();
    res.status(201).json({
      message: `Created ${providers.length} provider(s) from PROVIDER role users`,
      providers,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create providers from users" });
  }
};
const getAllProviders = async (req: Request, res: Response) => {
  try {
    const providers = await providerService.getAllProviders();
    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ error: "Failed to get providers" });
  }
};
const getProviderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const provider = await providerService.getsingleProvider(id as string);
    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ error: "Failed to get provider" });
  }
};
const updateProvider = async (req: Request, res: Response) => { };
const deleteProvider = async (req: Request, res: Response) => { };

export const providerController = {
  createProvider,
  createProvidersFromUsers,
  getAllProviders,
  getProviderById,
  updateProvider,
  deleteProvider,
};
