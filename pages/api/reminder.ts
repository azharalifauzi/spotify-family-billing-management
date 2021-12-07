import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
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

  const transporter = nodemailer.createTransport(
    smtpTransport({
      service: "sendinblue",
      host: "smtp-relay.sendinblue.com",
      port: 587,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  );

  if (req.method === "POST") {
    const { data: users } = await supabase
      .from<UserSchema>("users")
      .select()
      .filter("balance", "lt", SUBSCRIPTION_PRICE);

    if (!users || users.length === 0) {
      res
        .status(404)
        .json({ message: "There is no users to remind", data: null });
      return;
    }

    const loop = users.map(async ({ email, name }) => {
      if (!email) return;

      const mailOptions = {
        from: "spotify.family.ah@gmail.com",
        to: email,
        subject: "Spotify Family AH Billing Reminder",
        html: `<p>Hi ${name},</p>
        <p>Your amount of balance is not enough to continue Spotify Family AH Subscription. Please do not forget to top up :).</p>
        <p>Sincerely,</p>
        <p>Spotify Family AH Team</p>`,
      };

      await transporter.sendMail(mailOptions);
    });

    try {
      await Promise.all(loop);
      res.status(200).json({ message: "OK", data: null });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", data: null });
    }
  }
}
