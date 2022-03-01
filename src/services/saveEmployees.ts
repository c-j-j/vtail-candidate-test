import { IDynamoDBEmployee } from "../types";
import { IEmployee } from "../putEmployees.interfaces";
import CognitoIdentityServiceProvider from "aws-sdk/clients/cognitoidentityserviceprovider";
import { batchWrite } from "../aws/dynamoDB";
import { addUserToGroup, createUser } from "../aws/cognito";

export const saveEmployees = async (
  employees: IEmployee[],
  businessUnitId: string,
  companyId: string
): Promise<IDynamoDBEmployee[]> => {
  const tableName = process.env.TABLE_NAME as string;

  await createCognitoEmployeeUsers(employees);

  const employeeItems = employees.map((employee) =>
    transformToEmployeeItem(employee, businessUnitId, companyId)
  );

  await batchWrite(tableName, employeeItems);
  return employeeItems;
};

const createCognitoEmployeeUsers = async (
  employees: IEmployee[]
): Promise<void> => {
  const promises = employees.map((employee) =>
    createCognitoEmployeeUser(employee)
  );
  await Promise.all(promises);
};

const createCognitoEmployeeUser = async (
  employee: IEmployee
): Promise<CognitoIdentityServiceProvider.UserType> => {
  const newUser = await createUser(employee, {
    messageAction: "SUPPRESS",
  });
  const groupName = "employees";
  await addUserToGroup(newUser.Username as string, groupName);
  return newUser;
};

const transformToEmployeeItem = (
  employee: IEmployee,
  businessUnitId: string,
  companyId: string
): IDynamoDBEmployee => ({
  ...employee,
  PK: `EMPLOYEE#${employee.id}`,
  SK: `EMPLOYEE#${employee.id}`,
  businessUnitId,
  companyId,
});
