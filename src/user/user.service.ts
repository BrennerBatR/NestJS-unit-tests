import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entity/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(user: User): Promise<User> {
    const existUser = await this.userRepository.findOne({
      where: [{ cpf: user.cpf }],
    });
    if (existUser) {
      throw new HttpException(
        `Already exist user with this cpf`,
        HttpStatus.CONFLICT
      );
    }

    return await this.userRepository.create(user).save();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user)
      throw new HttpException(
        `User with id: ${user.id} not found`,
        HttpStatus.NOT_FOUND
      );

    return user;
  }

  async getAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    if (users.length == 0 || !users)
      throw new HttpException("Users not found", HttpStatus.NOT_FOUND);

    return users;
  }

  async update(id: string, user: User): Promise<User> {
    const verifyUser = await this.getUserById(id);
    if (!verifyUser)
      throw new HttpException(
        `User with id: ${id} not found`,
        HttpStatus.NOT_FOUND
      );
    user.id = id;
    user = await this.userRepository.preload(user);
    return await user.save();
  }

  async delete(id: string): Promise<string> {
    const verifyUser = await this.getUserById(id);
    if (!verifyUser)
      throw new HttpException(
        `User with id: ${id} not found`,
        HttpStatus.NOT_FOUND
      );
    await this.userRepository.remove(verifyUser);
    return id;
  }
}
