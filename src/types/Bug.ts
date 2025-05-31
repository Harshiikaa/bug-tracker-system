export interface Bug {
  _id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  createdBy?: { name: string };
  assignedTo?: { name: string };
  comments: Array<{
    text: string;
    createdBy: { name: string }; // Assuming you populate this
    createdAt: string; // Use string for JSON-serialized Date
  }>;
  createdAt: string;
  updatedAt: string;
}



// interface Bug {
//   _id: string;
//   title: string;
//   description: string;
//   status: string;
//   priority: string;
//   createdBy?: { name: string };
//   assignedTo?: { name: string };
// }