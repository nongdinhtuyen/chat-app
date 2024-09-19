export interface IUser {
  _id: string;
  username: string;
  refreshToken: string;
  image: string;
  role: {
    _id: string;
    name: string;
  };
}
