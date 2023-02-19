import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

describe("Get user balance", () => {
  const usersRepository = new InMemoryUsersRepository();
  const statementsRepository = new InMemoryStatementsRepository();
  const createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  const createUserUseCase = new CreateUserUseCase(usersRepository);
  const getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);

  var user_id = "";
  const deposit_amount = 100;
  const withdraw_amount = 52;

  beforeAll(async () => {
    const userData: ICreateUserDTO = {
      name: "Ricardo",
      email: "ricardo@email.com",
      password: "tHI$Password"
    }
    const user = await createUserUseCase.execute(userData);
    user_id = user.id || "";
  });

  it("should be able to get balance after user creation", async () => {
    const balance = await getBalanceUseCase.execute({user_id});
    expect(balance.balance).toEqual(0);
    expect(balance.statement).toHaveLength(0);
  });

  it("should be able to get balance after deposit", async () => {
    const data: ICreateStatementDTO = {
      user_id,
      type: OperationType.DEPOSIT,
      amount: deposit_amount,
      description: "Test description"
    };
    await createStatementUseCase.execute(data);
    const balance = await getBalanceUseCase.execute({user_id});
    expect(balance.balance).toEqual(deposit_amount);
    expect(balance.statement).toHaveLength(1);
  })

  it("should be able to get balance after withdraw", async () => {
    const data: ICreateStatementDTO = {
      user_id,
      type: OperationType.WITHDRAW,
      amount: withdraw_amount,
      description: "Test description"
    };
    await createStatementUseCase.execute(data);

    const balance = await getBalanceUseCase.execute({user_id});
    expect(balance.balance).toEqual(deposit_amount-withdraw_amount);
    expect(balance.statement).toHaveLength(2);
  })

  it("should NOT be able to get balance of invalid user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({user_id: "asdassa"})
    }).rejects.toBeInstanceOf(GetBalanceError);
  })
});