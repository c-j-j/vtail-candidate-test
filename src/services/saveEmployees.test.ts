import { saveEmployees } from "./saveEmployees";
import { fakeEmployee } from "../testUtils/fixtures";

jest.mock("../aws/cognito");
jest.mock("../aws/dynamoDB");

import { createUser, addUserToGroup } from "../aws/cognito";
import { batchWrite } from "../aws/dynamoDB";

describe("saveEmployees", () => {
  beforeEach(() => {
    process.env.TABLE_NAME = "test-table-name";
    (createUser as jest.Mock).mockResolvedValue({ Username: "created-user" });
  });

  afterEach(() => {
    jest.resetAllMocks();
    delete process.env.TABLE_NAME;
  });

  it("saves users in cognito", async () => {
    await saveEmployees([fakeEmployee], "some-business-id", "some-company-id");
    expect(createUser).toHaveBeenCalledWith(fakeEmployee, {
      messageAction: "SUPPRESS",
    });
    expect(addUserToGroup).toHaveBeenCalledWith("created-user", "employees");
  });

  it("saves users in dynamoDB after successfully saving to cognito", async () => {
    await saveEmployees([fakeEmployee], "some-business-id", "some-company-id");
    expect(batchWrite).toHaveBeenCalledWith("test-table-name", [
      {
        ...fakeEmployee,
        PK: `EMPLOYEE#${fakeEmployee.id}`,
        SK: `EMPLOYEE#${fakeEmployee.id}`,
        businessUnitId: "some-business-id",
        companyId: "some-company-id",
      },
    ]);
  });

  it("returns saved users", async () => {
    const employees = await saveEmployees(
      [fakeEmployee],
      "some-business-id",
      "some-company-id"
    );
    expect(employees).toEqual([
      {
        ...fakeEmployee,
        PK: `EMPLOYEE#${fakeEmployee.id}`,
        SK: `EMPLOYEE#${fakeEmployee.id}`,
        businessUnitId: "some-business-id",
        companyId: "some-company-id",
      },
    ]);
  });

  it("does not save users to dynamo when saving to cognito fails for any user", () => {
    (createUser as jest.Mock).mockRejectedValueOnce("Simulated error");
    expect(batchWrite).not.toHaveBeenCalled();
  });
});
