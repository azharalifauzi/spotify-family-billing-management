type TopupSchema = {
  user_id: number;
  value: number;
  id: number;
};

type UserSchema = {
  id: number;
  balance: number;
  is_active: booolean;
  email: string;
  name: string;
};

type SubscriptionSchema = {
  id: number;
  user_id: number;
  start_date: string;
  end_date: string;
};

type PaymentSchema = {
  id: number;
  user_id: number;
  value: number;
  payment_type: "start_subscription" | "recurring_billing";
  description: string;
};
