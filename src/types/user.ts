
export interface IUserCredentials {
  email: string;
  password: string;
};

export interface IUserProfile {
  id: string;
  display_name: string;
  avatar_url: string | null;
};