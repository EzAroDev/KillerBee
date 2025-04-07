import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilisateur } from '../entities/utilisateur.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UtilisateurService {
  constructor(
    @InjectRepository(Utilisateur)
    private userRepo: Repository<Utilisateur>,
  ) {}

  findAll() {
    return this.userRepo.find();
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { EmailUser: email } });
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: { IdUser: id } });
  }

  create(dto: CreateUserDto) {
    const newUser = this.userRepo.create(dto);
    return this.userRepo.save(newUser);
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.userRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.userRepo.delete(id);
  }
}
