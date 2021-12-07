import dayjs from "dayjs";
import { SUBSCRIPTION_PRICE } from "helpers/const";
import { supabase } from "libs/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { data, error } = await supabase
    .from<UserSchema>("users")
    .select()
    .eq("is_active", true);

  if (error) {
    res.status(500).json({ message: "Internal Server Error", data: null });
    return;
  }

  res.status(200).json({ data, message: "OK" });
}
