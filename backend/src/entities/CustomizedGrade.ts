import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('customized_grades')
class CustomizedGrade {
    @PrimaryGeneratedColumn()
    id_customized_grades: number;

    @Column()
    numeric_value: number;

    @Column()
    description: string;
}

export { CustomizedGrade };
