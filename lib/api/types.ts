interface ResponseErrorType {
  Success: false;
  ErrCode: number;
  ErrMsg: string;
  Data: null;
}

interface ResponseSuccessType<T> {
  Success: true;
  Data: T;
}

export type ResType<T> = ResponseErrorType | ResponseSuccessType<T>;

export interface UserProfileType {
  nickname: string;
  dep: string | null;
  org: string | null;
  email: string;
  avatar: string | null;
  bio: string | null;
  link: string[] | null;
  badge: { title: string; description: string; create_at: string }[] | null;
  hide: string[] | null;
}

export interface EditableProfileType {
  nickname?: string | null;
  org_id?: number;
  bio?: string;
  link?: string[] | null;
  hide?: string[] | null;
}

export interface UserAccount {
  token: string;
  avatar?: string | null;
  nickName?: string;
  email: string;
  userId: string;
}

export interface CurrentUserProfile {
  username: string;
  email: string;
  userId?: string;
  avatar?: string;
  organization?: string;
  description?: string;
  link?: string;
}
