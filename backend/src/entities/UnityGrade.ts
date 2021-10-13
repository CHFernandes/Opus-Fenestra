import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { CustomizedGrade } from './CustomizedGrade';
import { Unit } from './Unit';

@Entity('unity_grades')
class UnityGrade {
    @PrimaryGeneratedColumn()
    id_unity_grade: number;

    @JoinColumn({ name: 'id_unities'})
    @ManyToOne(() => Unit)
    unit: Unit;

    @Column()
    id_unities: number;

    @JoinColumn({ name: 'id_customized_grades'})
    @ManyToOne(() => CustomizedGrade)
    customizedGrade: CustomizedGrade;

    @Column()
    id_customized_grades: number;
}

export { UnityGrade };