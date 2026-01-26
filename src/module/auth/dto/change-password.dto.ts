// src/user/dto/change-password.dto.ts
import { IsOptional, IsString, MinLength } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class ChangePasswordDto {
  // 🔹 OPTIONAL NAME UPDATE
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Update full name (optional)',
  })
  @IsOptional()
  @IsString()
  fullName?: string

  // 🔹 PASSWORD CHANGE (OPTIONAL BUT LINKED)
  @ApiPropertyOptional({
    example: 'oldPassword123',
    description: 'Current password (required if changing password)',
  })
  @IsOptional()
  @IsString()
  oldPassword?: string

  @ApiPropertyOptional({
    example: 'newSecurePass456',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  newPassword?: string

  @ApiPropertyOptional({
    example: 'newSecurePass456',
  })
  @IsOptional()
  @IsString()
  confirmPassword?: string
}
