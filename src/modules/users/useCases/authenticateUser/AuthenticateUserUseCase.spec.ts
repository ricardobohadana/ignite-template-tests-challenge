import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

describe("Authenticate User", () => {
  const usersRepository = new InMemoryUsersRepository();
  const createUserUseCase = new CreateUserUseCase(usersRepository);
  const authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  
  var user_id = "";
  
  const userData: ICreateUserDTO = {
    name: "Ricardo",
    email: "ricardo@email.com",
    password: "tHI$Password"
  }

  beforeAll(async () => {

    const user = await createUserUseCase.execute(userData);
    user_id = user.id || "";
  });

  it("should be able to authenticate the user", async () => {
    const request = {
      email: userData.email,
      password: userData.password
    };

    const response = await authenticateUserUseCase.execute(request);

    expect(response).toHaveProperty("token");
    expect(response).toHaveProperty("user");
    expect(response.user.name).toEqual(userData.name);
  });

  it("should NOT be able to authenticate the user with invalid password", async () => {
    const request = {
      email: userData.email,
      password: userData.password + "asdas"
    };
    expect(async () => {
      await authenticateUserUseCase.execute(request);
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should NOT be able to authenticate the user with invalid email", async () => {
    const request = {
      email: userData.email + '.br',
      password: userData.password
    };
    expect(async () => {
      await authenticateUserUseCase.execute(request);
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
})