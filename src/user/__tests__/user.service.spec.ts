import { HttpException, HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MockType, mockedUser, repositoryMockFactory } from "../../mock";
import { User } from "../entity/user.entity";
import { UserService } from "../user.service";

/**
 * @jest-environment .env.test.yml
 */
describe("UserService", () => {
  let service: UserService;
  let repositoryMock: MockType<Repository<User>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repositoryMock = module.get(getRepositoryToken(User));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("Create a user", () => {
    it("should create a user", async () => {
      repositoryMock.create.mockReturnValue({ save: () => mockedUser });

      repositoryMock.findOne.mockReturnValue(undefined);
      expect(await service.create(mockedUser as User)).toEqual(mockedUser);
      expect(repositoryMock.create).toHaveBeenCalledWith(mockedUser);
    });

    it("should throw error if user exists", async () => {
      repositoryMock.findOne.mockReturnValue(mockedUser);
      try {
        await service.create(mockedUser);
      } catch (e) {
        expect(e).toEqual(
          new HttpException(
            "Already exist user with this cpf",
            HttpStatus.CONFLICT
          )
        );
      }
    });
  });

  describe("Get user", () => {
    it("should return user", async () => {
      repositoryMock.findOne.mockReturnValue(mockedUser);
      expect(await service.getUserById(mockedUser.id)).toBe(mockedUser);
    });
  });

  describe("Update user", () => {
    it("should return user ", async () => {
      repositoryMock.findOne.mockReturnValue(mockedUser);
      repositoryMock.preload.mockReturnValue({ preload: () => mockedUser });
      repositoryMock.preload.mockReturnValue({ save: () => mockedUser });
      expect(await service.update(mockedUser.id, mockedUser)).toBe(mockedUser);
    });
  });
});
