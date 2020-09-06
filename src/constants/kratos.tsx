interface FormLabel {
  label: string;
  priority: number;
}

export const FORM_LABELS: { [key: string]: FormLabel } = {
  to_verify: {
    label: "EMAIL",
    priority: 100,
  },
  csrf_token: {
    label: "",
    priority: 100,
  },
  "traits.email": {
    label: "EMAIL",
    priority: 90,
  },
  "traits.username": {
    label: "USERNAME",
    priority: 89,
  },
  "traits.nickname": {
    label: "NICKNAME",
    priority: 88,
  },
  email: {
    label: "EMAIL",
    priority: 80,
  },
  identifier: {
    label: "IDENTIFIER",
    priority: 80,
  },
  password: {
    label: "PASSWORD",
    priority: 80,
  },
};
