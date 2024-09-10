import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsIn,
  IsDateString,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  completed: boolean;

  @IsOptional()
  @IsIn(['Low', 'Medium', 'High'])
  priority: 'Low' | 'Medium' | 'High';

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsDateString()
  deadline: Date;
}
