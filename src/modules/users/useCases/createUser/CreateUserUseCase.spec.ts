import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

describe("Create User", () => {
  const usersRepository = new InMemoryUsersRepository();
  const createUserUseCase = new CreateUserUseCase(usersRepository);

  it("should be able to create a user", async () => {
    const userData: ICreateUserDTO = {
      name: "Ricardo",
      email: "ricardo@email.com",
      password: "tHI$Password"
    }
    const user = await createUserUseCase.execute(userData);

    expect(user.email).toEqual(userData.email);
    expect(user.name).toEqual(userData.name);
    expect(user.id).not.toBeNull();
    expect(user.password).not.toEqual(userData.password);
  });

  it("should not be able to create a user with an already existing email", async () => {
    const userData: ICreateUserDTO = {
      name: "Ricardo",
      email: "ricardo@email.com",
      password: "tHI$Password"
    }
    expect(async () => {
      await createUserUseCase.execute(userData)
    }).rejects.toBeInstanceOf(CreateUserError)
  });
})