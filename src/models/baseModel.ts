import { supabase } from "../config/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

export class BaseModel {
  // Method to get the appropriate client
  // If an authenticated client is provided, use it, otherwise use the anonymous client
  protected static getClient(authClient?: SupabaseClient): SupabaseClient {
    return authClient || supabase;
  }
}