import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async updateUser(userId: string, updateDto: UpdateUserDto): Promise<UserEntity> {
    // Trim whitespace from name
    const trimmedName = updateDto.name.trim();

    // Find user
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['organization'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Update name
    user.name = trimmedName;
    const updatedUser = await this.userRepository.save(user);

    return updatedUser;
  }
}

