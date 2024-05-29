import { Table, Column, Model, DataType, PrimaryKey, BelongsToMany, HasMany } from 'sequelize-typescript';
import Book  from './Book'; // Assuming Book model is in the same directory
import UserBook from './UserBooks';

export interface UserAttributes {
  token: string;
}

@Table({
  tableName: 'users',
  timestamps: false,
})
class User extends Model<UserAttributes> implements UserAttributes {

  @PrimaryKey
  @Column({
    type: DataType.STRING, 
  })
  token!: string;


  @BelongsToMany(() => Book, () => UserBook )  
  books!: Book[]; // Array of associated books


}

export default User;
