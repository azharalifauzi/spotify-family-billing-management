// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
  if (req.headers.authorization !== `Bearer ${process.env.API_SECRET_KEY}`) {
    res.status(401).json({ message: "Unauthorization user", data: null });
    return;
  }

  const user_id = req.body.user_id;
  const value = req.body.value;

  if (req.method === "POST") {
    const { data: userData } = await supabase
      .from<UserSchema>("users")
      .select()
      .eq("id", user_id);

    if (userData?.length === 0) {
      res.status(400).json({ message: "user not found", data: null });
      return;
    }

    const { data, error } = await supabase.from<TopupSchema>("topup").insert([
      {
        user_id,
        value,
      },
    ]);

    if (error) {
      res.status(400).json({ message: "error", data: error });
      return;
    }

    if (userData)
      await supabase
        .from<UserSchema>("users")
        .update({ balance: userData[0].balance + value })
        .match({ id: user_id });

    res.status(201).json({ data, message: "Created" });
  }
}
