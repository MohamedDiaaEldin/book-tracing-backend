import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table
class Book extends Model<Book> {

    @PrimaryKey
    @Column
      title!: string;

    @Column
      subtitle!: string;

    @Column(DataType.ARRAY(DataType.STRING))
      authors!: string[];

    @Column
      publisher!: string;

    @Column
      publishedDate!: Date;

}

export default Book;
