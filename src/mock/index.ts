import { Repository } from "typeorm";
import { User } from "../user/entity/user.entity";
import { v4 as uuidv4 } from "uuid";

export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};

it("just passes", () => {
  expect(true).toBe(true);
});

export const mockedUser = {
  id: uuidv4(),
  userName: "userName",
  password: "password",
  cpf: "cpf",
  createDate: "2021-02-17",
  updateDate: "2021-02-17",
  active: true,
} as User;

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    remove: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
    findOne: jest.fn((entity) => entity),
    findOneOrFail: jest.fn(() => mockedUser),
    save: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    createImage: jest.fn((entity) => entity),
    preload: jest.fn((entity) => entity),
    findAndCount: jest.fn((entity) => entity),
    find: jest.fn((entity) => entity),
    findByIds: jest.fn((entity) => entity),
    count: jest.fn((entity) => entity),
  })
);
