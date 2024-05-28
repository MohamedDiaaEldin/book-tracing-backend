import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';


@Table
class Book extends Model<Book> {

    @PrimaryKey
    @Column
      id!: string;
      
    @Column
    title!: string;


    @Column(DataType.ARRAY(DataType.STRING))
    authors!: string[];

    @Column
    smallThumbnail!: string;


}

export default Book;
