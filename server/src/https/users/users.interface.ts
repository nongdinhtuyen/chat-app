export interface IUser {
  _id: string;
  username: string;
  refreshToken: string;
  role: {
    _id: string;
    name: string;
  };
}
