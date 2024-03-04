import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { MemberType, MemberTypeId } from "../types/member-types.js";
import { prisma } from "../pismaClient/prismaClient.js";
import { PostType } from "../types/posts.js";
import { UserType } from "../types/users.js";
import { ProfileType } from "../types/profiles.js";
import { UUIDType } from "../types/uuid.js";


export const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve() {
        return prisma.memberType.findMany();
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve() {
        return prisma.post.findMany();
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return prisma.user.findMany();
      }
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve() {
        return prisma.profile.findMany();
      }
    },
    memberType: {
      type: MemberType,
      args: {
        id: {
          type: new GraphQLNonNull(MemberTypeId),
        },
      },
      resolve: (prevState, { id }: { id: string }) => {
        return prisma.memberType.findUnique({ where: { id } });
      },
    },
    post: {
      type: PostType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: (prevState, { id }: { id: string }) => {
        return prisma.post.findUnique({ where: { id } });
      },
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: (prevState, { id }: { id: string }) => {
        return prisma.user.findUnique({
          where: { id },
        });
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: (prevState, { id }: { id: string }) => {
        return prisma.profile.findUnique({
          where: { id },
          include: { memberType: true },
        });
      },
    },
  }
});