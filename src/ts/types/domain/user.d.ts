type DomainUser = {
  _id?: ObjectId;
  email: string;
  name: string;
  role: string;
  created_at: Date;
  updated_at: Date;
};

type DomainUserUpdate = {
  id: number;
  name: string;
};

export { DomainUser, DomainUserUpdate };
