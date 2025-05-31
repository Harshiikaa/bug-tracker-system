interface Bug {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdBy?: { name: string };
  assignedTo?: { name: string };
}