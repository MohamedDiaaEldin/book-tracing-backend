import { Table, Column, Model, DataType, PrimaryKey, BelongsToMany } from 'sequelize-typescript';
import User from './User';
import UserBook from './UserBooks';

export interface BookAttributes {
  id: string;
  title: string;
  authors: string[];
  smallThumbnail: string;
}

@Table({
  tableName: 'books',
  timestamps: false,
})
class Book extends Model<BookAttributes> implements BookAttributes {

  @PrimaryKey
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    title!: string;

  @Column({
    allowNull: false,
    type: DataType.ARRAY(DataType.STRING),
  })
    authors!: string[];

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    smallThumbnail!: string;

  @BelongsToMany(() => User,  () => UserBook )
    users!: User[];

}

export default Book;
