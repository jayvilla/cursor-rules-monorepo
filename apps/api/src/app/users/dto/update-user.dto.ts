import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User name',
    minLength: 1,
    maxLength: 100,
    example: 'John Doe',
  })
  @IsString()
  @MinLength(1, { message: 'Name must be at least 1 character long' })
  @MaxLength(100, { message: 'Name must be at most 100 characters long' })
  name: string;
}

