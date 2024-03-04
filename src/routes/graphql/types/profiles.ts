import { GraphQLObjectType, GraphQLBoolean, GraphQLInt, GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeId } from './member-types.js';
import { Context } from '../pismaClient/type.js';
import { MemberTypeId as MemberIdType } from '../../member-types/schemas.js';

interface ISource {
  memberTypeId: MemberIdType;
}

export const ProfileType = new GraphQLObjectType({
  name: 'ProfileType',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberType: {
      type: MemberType,
      resolve: (source: ISource, _args, { prisma }: Context) =>
        prisma.memberType.findUnique({ where: { id: source.memberTypeId } }),
    },
  }),
});

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt }
  }),
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    memberTypeId: { type: MemberTypeId },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt }
  }),
});