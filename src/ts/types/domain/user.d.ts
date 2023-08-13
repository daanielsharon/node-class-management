type DomainUser = {
  _id?: ObjectId;
  email: string;
  name: string;
  role: string;
  created_at: Date;
  updated_at: Date;
};

type DomainUserUpdate = {
  id: string;
  name: string;
};

export { DomainUser, DomainUserUpdate };
