"use server";
import { getSuggestedItems } from "@/lib/search";

export async function getsuggestedResults(searchTerm, categoryTerm) {

  const { data } = await getSuggestedItems(searchTerm, categoryTerm);

  return data;
}
