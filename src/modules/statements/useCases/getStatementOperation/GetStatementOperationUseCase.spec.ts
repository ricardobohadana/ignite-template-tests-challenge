import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

describe("Get user balance", () => {
  const usersRepository = new InMemoryUsersRepository();
  const statementsRepository = new InMemoryStatementsRepository();
  const createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  const createUserUseCase = new CreateUserUseCase(usersRepository);
  const getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);

  var user_id = "";
  var statement_id_1 = "";
  var statement_id_2 = "";
  const deposit_amount = 100;
  const withdraw_amount = 52;

  const statement_data_1: ICreateStatementDTO = {
    user_id,
    type: OperationType.DEPOSIT,
    amount: deposit_amount,
    description: "Test description"
  };

  const statement_data_2: ICreateStatementDTO = {
    user_id,
    type: OperationType.WITHDRAW,
    amount: withdraw_amount,
    description: "Test description2"
  };

  beforeAll(async () => {
    const userData: ICreateUserDTO = {
      name: "Ricardo",
      email: "ricardo@email.com",
      password: "tHI$Password"
    }
    const user = await createUserUseCase.execute(userData);
    user_id = user.id || "";
    statement_data_1.user_id = user_id;
    statement_data_2.user_id = user_id;

    const op = await createStatementUseCase.execute(statement_data_1);
    statement_id_1 = op.id || "";
    

    const op2 = await createStatementUseCase.execute(statement_data_2);
    statement_id_2 = op2.id || "";
  });

  it("should be able to get statement operation for deposit", async () => {
    const statement = await getStatementOperationUseCase.execute({user_id, statement_id: statement_id_1});
    expect(statement.amount).toEqual(statement_data_1.amount);
    expect(statement.description).toEqual(statement_data_1.description);
    expect(statement.type).toEqual(statement_data_1.type);
    expect(statement.user_id).toEqual(statement_data_1.user_id);
  });

  it("should be able to get statement operation for withdraw", async () => {
    const statement = await getStatementOperationUseCase.execute({user_id, statement_id: statement_id_2});
    expect(statement.amount).toEqual(statement_data_2.amount);
    expect(statement.description).toEqual(statement_data_2.description);
    expect(statement.type).toEqual(statement_data_2.type);
    expect(statement.user_id).toEqual(statement_data_2.user_id);
  });

  it("should NOT be able to get statement operation of invalid user_id", async () => {
    expect(async () => {
      const statement = await getStatementOperationUseCase.execute({user_id: "adsdf", statement_id: statement_id_2});
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  })

  it("should NOT be able to get statement operation of invalid statement_id", async () => {
    expect(async () => {
      const statement = await getStatementOperationUseCase.execute({user_id, statement_id: "asdasdas"});
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  })
});