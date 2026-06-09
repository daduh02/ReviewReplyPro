export const leadStatuses = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "demo_booked", label: "Demo Booked" },
  { value: "pilot_customer", label: "Pilot Customer" },
  { value: "not_interested", label: "Not Interested" },
];

export const leadStatusLabels = Object.fromEntries(
  leadStatuses.map((status) => [status.value, status.label]),
);
