export interface Bug {
  _id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  createdBy?: { name: string };
  assignedTo?:string | { _id: string; name: string };

  // assignedTo?: { name: string };
  comments: Array<{
    text: string;
    createdBy: { name: string }; 
    createdAt: string; 
  }>;
  createdAt: string;
  updatedAt: string;
}


