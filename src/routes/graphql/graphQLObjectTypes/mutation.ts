import { prisma } from "../pismaClient/prismaClient.js";
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "../types/uuid.js";
import { ChangePostInput, CreatePostInput, PostType } from "../types/posts.js";
import { ChangeUserInput, CreateUserInput, UserType } from "../types/users.js";
import { ChangeProfileInput, CreateProfileInput, ProfileType } from "../types/profiles.js";
import { MemberTypeId as MemberIdType } from '../../member-types/schemas.js';


export const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: PostType,
      args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
      resolve: (
        prevState,
        { dto }: { dto: { authorId: string; title: string; content: string; }; },
        _context,
      ) => {
        return prisma.post.create({ data: dto });
      },
    },
    createUser: {
      type: UserType,
      args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
      resolve: (
        prevState,
        { dto }: { dto: { name: string; balance: number; }; },
        _context,
      ) => {
        return prisma.user.create({ data: dto });
      },
    },
    createProfile: {
      type: ProfileType,
      args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
      resolve: (
        prevState,
        { dto }: {
          dto: {
            userId: string;
            memberTypeId: MemberIdType;
            isMale: boolean;
            yearOfBirth: number;
          };
        },
        _context,
      ) => {
        return prisma.profile.create({ data: dto });
      },
    },

    deleteProfile: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (
        prevState, { id }: { id: string; }, _context,
      ) => {
        await prisma.profile.delete({ where: { id } });
        return null;
      },
    },
    deletePost: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (
        prevState, { id }: { id: string; }, _context,
      ) => {
        await prisma.post.delete({ where: { id } });
        return null;
      },
    },
    deleteUser: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (
        prevState, { id }: { id: string; }, _context,
      ) => {
        await prisma.user.delete({ where: { id } });
        return null;
      },
    },

    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) }
      },
      resolve: (
        prevState,
        { id, dto }: { id: string, dto: { title: string; content: string; }; },
        _context,
      ) => {
        return prisma.post.update({ where: { id }, data: dto });
      },
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) }
      },
      resolve: (
        prevState,
        { id, dto }: { id: string, dto: { memberTypeId: MemberIdType; isMale: boolean; yearOfBirth: number; }; },
        _context,
      ) => {
        return prisma.profile.update({ where: { id }, data: dto });
      },
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) }
      },
      resolve: (
        prevState,
        { id, dto }: { id: string, dto: { name: string; balance: number; }; },
        _context,
      ) => {
        return prisma.user.update({ where: { id }, data: dto });
      },
    },

    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: (
        prevState,
        { userId, authorId }: { userId: string; authorId: string, },
        _context,
      ) => {
        return prisma.user.update({ where: { id: userId }, data: { userSubscribedTo: { create: { authorId } } } });
      },
    },
    unsubscribeFrom: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (
        prevState,
        { userId, authorId }: { userId: string; authorId: string; },
        _context,
      ) => {
        await prisma.subscribersOnAuthors.delete(
          {
            where: {
              subscriberId_authorId: {
                subscriberId: userId,
                authorId
              }
            }
          });
        return null;
      },
    },
  }
});