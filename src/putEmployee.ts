import { IEventWithPutEmployeesArguments } from "./putEmployees.interfaces";
import { saveEmployees } from "./services/saveEmployees";

const validate = (event: IEventWithPutEmployeesArguments) => {
  const { employees, businessUnitId, companyId } = event.body;

  if (!employees || employees.length === 0) {
    throw new Error("No employees specified in input");
  }

  if (!businessUnitId || businessUnitId.length === 0) {
    throw new Error("businessUnitId not specified in input");
  }

  if (!companyId || companyId.length === 0) {
    throw new Error("companyId not specified in input");
  }
};

export const putEmployees = async (event: IEventWithPutEmployeesArguments) => {
  try {
    validate(event);
    const { employees, businessUnitId, companyId } = event.body;
    return await saveEmployees(employees, businessUnitId, companyId);
  } catch (e) {
    console.error(event.body, e);
    throw e;
  }
};
