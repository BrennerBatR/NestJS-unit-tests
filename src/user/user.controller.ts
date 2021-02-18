import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  HttpException,
  Patch,
  Body,
  Param,
  Post,
  Delete
} from "@nestjs/common";
import { UserService } from "./user.service";
import {
  ApiResponse,
  ApiModelProperty,
  ApiImplicitParam,
  ApiUseTags
} from "@nestjs/swagger";
import { User } from "./entity/user.entity";

@Controller("user")
@ApiUseTags("User")
export class UserController {
  constructor(public service: UserService) {}

  @Post()
  @ApiModelProperty()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Usuário criado com sucesso"
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Já existe um Usuário com este email"
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Dados inválidos"
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() user: User) {
    try {
      return await this.service.create(user);
    } catch (error) {
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get("/:id")
  @ApiResponse({ status: HttpStatus.OK, description: "User" })
  @ApiImplicitParam({ name: "id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Usuário encontrado com sucesso"
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Usuário não encontrado"
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Erro interno no servidor"
  })
  @HttpCode(HttpStatus.OK)
  async getById(@Param("id") id: string) {
    try {
      return await this.service.getUserById(id);
    } catch (error) {
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Usuários encontrados com sucesso"
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Dados inválidos"
  })
  @HttpCode(HttpStatus.OK)
  async getAll() {
    try {
      return await this.service.getAll();
    } catch (error) {
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch("/:id")
  @ApiImplicitParam({ name: "id" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Usuário atualizado com sucesso"
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Dados inválidos"
  })
  @HttpCode(HttpStatus.OK)
  async update(@Param("id") id: string, @Body() user: User) {
    try {
      return await this.service.update(id, user);
    } catch (error) {
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete("/:id")
  @ApiImplicitParam({ name: "id" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Usuário deletado com sucesso"
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Dados inválidos"
  })
  @HttpCode(HttpStatus.OK)
  async delete(@Param("id") id: string) {
    try {
      return await this.service.delete(id);
    } catch (error) {
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
