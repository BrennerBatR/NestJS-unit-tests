import { HttpException, HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { mockedUser, repositoryMockFactory } from "../../mock";
import { User } from "../entity/user.entity";
import { UserController } from "../user.controller";
import { UserService } from "../user.service";

describe("User Controller", () => {
  let controller: UserController;
  let service: UserService;

  beforeAll(async () => {
    jest.resetModules();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create User", () => {
    it("should return userId on create", async () => {
      jest
        .spyOn(service, "create")
        .mockImplementation(() => Promise.resolve(mockedUser));

      expect(await controller.create(mockedUser as User)).toBe(mockedUser);
    });

    it("should return HttpStatus Conflict", async () => {
      jest
        .spyOn(service, "create")
        .mockRejectedValue(
          new HttpException(`Already exist user with cpf`, HttpStatus.CONFLICT)
        );

      await expect(
        controller.create(mockedUser as User)
      ).resolves.toBeInstanceOf(HttpException);
    });
  });

  describe("Get user by id", () => {
    const query = { userId: mockedUser.id };

    it("should return a user", async () => {
      jest
        .spyOn(service, "getUserById")
        .mockImplementation(() => Promise.resolve(mockedUser as User));

      expect(await controller.getById(mockedUser.id)).toBe(mockedUser);
    });
    it("should return a HttpStatus Not Found", async () => {
      jest
        .spyOn(service, "getUserById")
        .mockRejectedValue(
          new HttpException("User not found", HttpStatus.NOT_FOUND)
        );

      await expect(controller.getById(mockedUser.id)).resolves.toBeInstanceOf(
        HttpException
      );
    });
  });

  describe("Update user", () => {
    it("should return a userId", async () => {
      const updateUserMock = mockedUser;
      updateUserMock.userName = "UPDATE";
      jest
        .spyOn(service, "update")
        .mockImplementation(() => Promise.resolve(mockedUser));

      expect(await controller.update(updateUserMock.id, updateUserMock)).toBe(
        updateUserMock
      );
    });
  });
});
