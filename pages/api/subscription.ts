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
  if (req.headers.authorization !== `Bearer ${process.env.API_SECRET_KEY}`) {
    res.status(401).json({ message: "Unauthorization user", data: null });
    return;
  }

  const user_id = req.body.user_id;
  const start_date = req.body.start_date;

  if (req.method === "POST") {
    const { data: userData } = await supabase
      .from<UserSchema>("users")
      .select()
      .eq("id", user_id);

    if (userData?.length === 0) {
      res.status(400).json({ message: "user not found", data: null });
      return;
    }

    const startDate = dayjs(start_date);
    const { data, error } = await supabase
      .from<SubscriptionSchema>("subscription")
      .insert([
        {
          user_id,
          start_date: startDate.toISOString(),
          end_date: startDate.add(1, "month").toISOString(),
        },
      ]);

    if (error) {
      res.status(400).json({ message: "error", data: error });
      return;
    }

    if (userData)
      await supabase
        .from<UserSchema>("users")
        .update({
          balance: userData[0].balance - SUBSCRIPTION_PRICE,
          is_active: true,
          is_subscribe: true,
        })
        .match({ id: user_id });

    await supabase.from<PaymentSchema>("payment").insert([
      {
        user_id,
        payment_type: "start_subscription",
        value: SUBSCRIPTION_PRICE,
      },
    ]);

    res.status(201).json({ message: "Created", data });
  }
}
