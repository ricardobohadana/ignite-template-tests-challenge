import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe("Show User Profile", () => {
  const usersRepository = new InMemoryUsersRepository();
  const createUserUseCase = new CreateUserUseCase(usersRepository);
  const showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  
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

  it("should be able to show a valid user profile", async () => {
    const profile = await showUserProfileUseCase.execute(user_id);

    expect(profile.email).toEqual(userData.email);
    expect(profile.name).toEqual(userData.name);
    expect(profile.statement).toBeUndefined();
  });

  it("should NOT be able to show an invalid user profile", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute(user_id + "asd");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});