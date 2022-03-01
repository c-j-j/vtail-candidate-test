import { generate } from "generate-password";
import CognitoIdentityServiceProvider, {
  AdminCreateUserRequest,
} from "aws-sdk/clients/cognitoidentityserviceprovider";

type ICustomParams = {
  messageAction?: string;
};
export const createUser = async (
  user: { email: string; firstName: string; lastName: string },
  customParams?: ICustomParams
) => {
  const password = generate({
    length: 8,
    numbers: true,
    strict: true,
    excludeSimilarCharacters: true,
  });
  const params: AdminCreateUserRequest = {
    UserPoolId: process.env.USER_POOL_ID!,
    Username: user.email,
    DesiredDeliveryMediums: ["EMAIL"],
    ForceAliasCreation: false,
    TemporaryPassword: password,
    UserAttributes: [
      {
        Name: "given_name",
        Value: user.firstName,
      },
      {
        Name: "family_name",
        Value: user.lastName,
      },
      {
        Name: "email",
        Value: user.email,
      },
      { Name: "email_verified", Value: "true" },
    ],
  };
  if (customParams?.messageAction) {
    params.MessageAction = customParams.messageAction;
  }

  const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
    apiVersion: "2016-04-19",
  });

  const userResult = await cognitoIdentityServiceProvider
    .adminCreateUser(params)
    .promise();

  return {
    ...userResult.User,
    password,
  };
};

export const addUserToGroup = async (
  userId: string,
  groupName: string
): Promise<void> => {
  const adminAddUserToGroupParams = {
    GroupName: groupName,
    UserPoolId: process.env.USER_POOL_ID!,
    Username: userId,
  };

  const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
    apiVersion: "2016-04-19",
  });

  await cognitoIdentityServiceProvider
    .adminAddUserToGroup(adminAddUserToGroupParams)
    .promise();
};
