import { CognitoIdentityServiceProvider } from "aws-sdk";

export interface IState {
  code: string;
  name: string;
}
export interface IEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  areasOfPracticeIds: string[];
  sitesOfCareIds: string[];
  zipCodes: string[];
  states: IState[];
  areasOfSpecialisationIds: string[];
}

export interface IPutEmployeesArguments {
  businessUnitId: string;
  companyId: string;
  employees: IEmployee[];
}

export interface IEventWithPutEmployeesArguments {
  body: IPutEmployeesArguments;
}

export interface ICognitoUserWithPassword
  extends CognitoIdentityServiceProvider.UserType {}
