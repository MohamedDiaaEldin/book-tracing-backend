import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import User  from './User';
import  Book  from './Book';

interface UserBookAttributes {
    userToken: string,
    bookId: string
    shelf: string
}

@Table({
  tableName: 'UserBooks',
  timestamps: false,
})
class UserBook extends Model<UserBookAttributes> implements UserBookAttributes {

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
  })
    userToken!: string;

  @ForeignKey(() => Book)
  @Column({
    type: DataType.STRING,
  })
    bookId!: string;

  @Column({
    type: DataType.STRING,
  })
    shelf! : string;

}

export default UserBook;
