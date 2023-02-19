import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

describe("Create Statement", () => {
  const usersRepository = new InMemoryUsersRepository();
  const statementsRepository = new InMemoryStatementsRepository();
  const createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  const createUserUseCase = new CreateUserUseCase(usersRepository);
  var user_id = "";

  beforeAll(async () => {
    const userData: ICreateUserDTO = {
      name: "Ricardo",
      email: "ricardo@email.com",
      password: "tHI$Password"
    }
    const user = await createUserUseCase.execute(userData);
    user_id = user.id || "";
  });

  it("should create a valid statement from deposit", async () => {
    const data: ICreateStatementDTO = {
      user_id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Test description"
    };
    
    const operation = await createStatementUseCase.execute(data);
    
    expect(operation.amount).toEqual(data.amount);
    expect(operation.type).toEqual(data.type);
    expect(operation.user_id).toEqual(operation.user_id);
    expect(operation.description).toEqual(operation.description);
  });

  it("should create a valid statement from withdraw", async () => {
    const data: ICreateStatementDTO = {
      user_id,
      type: OperationType.WITHDRAW,
      amount: 50,
      description: "Test description"
    };
    
    const operation = await createStatementUseCase.execute(data);
    
    expect(operation.amount).toEqual(data.amount);
    expect(operation.type).toEqual(data.type);
    expect(operation.user_id).toEqual(operation.user_id);
    expect(operation.description).toEqual(operation.description);
  });

  it("should NOT create a valid statement from withdraw", async () => {
    const data: ICreateStatementDTO = {
      user_id,
      type: OperationType.WITHDRAW,
      amount: 100,
      description: "Test description"
    };
    
    expect(async () => {
      await createStatementUseCase.execute(data);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  });


  it("should not create a valid statement for invalid user", async () => {
    const data: ICreateStatementDTO = {
      user_id: "",
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Test description"
    };
    
    expect(async () => {
      await createStatementUseCase.execute(data)
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
})