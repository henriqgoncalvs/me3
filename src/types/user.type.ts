import {
  User as UserFromPrisma,
  UserSong,
  UserMovie,
  UserAdjective,
  UserSkills,
} from '@prisma/client';

export type User = UserFromPrisma & {
  UserSong: UserSong[];
  UserMovie: UserMovie[];
  UserAdjective: UserAdjective[];
  UserSkills: UserSkills[];
};
