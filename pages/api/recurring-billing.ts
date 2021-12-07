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

  if (req.method === "POST") {
    const today = dayjs();

    const { data: subscriptions } = await supabase
      .from<SubscriptionSchema>("subscription")
      .select()
      .filter("end_date", "eq", today.toISOString());

    if (subscriptions?.length === 0) {
      res
        .status(404)
        .json({ message: "There is no user to be billed", data: null });
      return;
    }

    if (subscriptions) {
      const loop = subscriptions.map(async ({ user_id, id }) => {
        await supabase.from<PaymentSchema>("payment").insert([
          {
            user_id,
            value: SUBSCRIPTION_PRICE,
            payment_type: "recurring_billing",
          },
        ]);

        const { data } = await supabase
          .from<UserSchema>("users")
          .select()
          .eq("id", user_id);

        if (data && data.length > 0) {
          await supabase
            .from<UserSchema>("users")
            .update({ balance: data[0].balance - SUBSCRIPTION_PRICE })
            .match({ id: user_id });

          await supabase
            .from<SubscriptionSchema>("subscription")
            .update({
              start_date: today.toISOString(),
              end_date: today.add(1, "month").toISOString(),
            })
            .match({ id });
        }
      });

      try {
        await Promise.all(loop);
        res.status(200).json({ message: "OK", data: null });
      } catch (error) {
        res.status(500).json({ message: "error", data: error });
      }
    }
  }
}
