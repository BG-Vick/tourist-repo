import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Post } from 'src/posts/posts.model';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';

interface UserCreateAttrs {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreateAttrs> {
  @ApiProperty({ example: '1', description: 'id' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @ApiProperty({ example: 'user@mail.com', description: 'почтовый адрес' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;
  @ApiProperty({ example: 'qwerty12345', description: 'пароль пользователя' })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;
  @ApiProperty({ example: 'true', description: 'Забанен или нет boolean' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  banned: boolean;
  @ApiProperty({
    example: 'За оскорбление участников',
    description: 'Причина блокировки',
  })
  @Column({ type: DataType.STRING, allowNull: true })
  banReason: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @HasMany(() => Post)
  posts: Post[];
}
