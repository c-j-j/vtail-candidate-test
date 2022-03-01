import { putEmployees } from "./putEmployee";
import { IEventWithPutEmployeesArguments } from "./putEmployees.interfaces";

jest.mock("./services/saveEmployees");
import { saveEmployees } from "./services/saveEmployees";
import { fakeEmployee } from "./testUtils/fixtures";

describe("putEmployee", () => {
  beforeEach(() => {
    console.error = jest.fn();
    (saveEmployees as jest.Mock).mockImplementation((employees) => employees);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("validation", () => {
    it("fails to validate when no employees passed", async () => {
      const event: IEventWithPutEmployeesArguments = {
        body: {
          employees: [],
          businessUnitId: "some-business-unit-id",
          companyId: "some-company-id",
        },
      };
      await expect(() => putEmployees(event)).rejects.toThrow(
        "No employees specified in input"
      );
    });
  });

  it("saves and returns employees", async () => {
    const event: IEventWithPutEmployeesArguments = {
      body: {
        employees: [fakeEmployee],
        businessUnitId: "some-business-unit-id",
        companyId: "some-company-id",
      },
    };
    const savedEmployees = await putEmployees(event);
    expect(savedEmployees.length).toEqual(1);
  });
});
