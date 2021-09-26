import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Project } from './Project';
import { Criterion } from './Criterion';

@Entity('evaluation')
class Evaluation {
    @PrimaryGeneratedColumn()
    id_evaluation: number;

    @JoinColumn({ name: 'id_project'})
    @ManyToOne(() => Project)
    project: Project;

    @Column()
    id_project: number;

    @JoinColumn({ name: 'id_criteria'})
    @ManyToOne(() => Criterion)
    criterion: Criterion;

    @Column()
    id_criteria: number;

    @Column()
    evaluation_date: Date;

    @Column()
    value: number;

}

export { Evaluation };