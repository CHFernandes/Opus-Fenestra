import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { Status } from './Status';
import { Portfolio } from './Portfolio';
import { Person } from './Person';

@Entity('project')
class Project {
    @PrimaryGeneratedColumn()
    id_project: number;

    @JoinColumn({ name: 'id_status' })
    @ManyToOne(() => Status)
    status: Status;

    @Column()
    id_status: number;

    @Column()
    id_category: number;

    @JoinColumn({ name: 'id_portfolio' })
    @ManyToOne(() => Portfolio)
    portfolio: Portfolio;

    @Column()
    id_portfolio: number;

    @Column()
    description: string;

    @Column()
    name: string;

    @JoinColumn([
        { name: 'responsible', referencedColumnName: 'id_person' },
        { name: 'submitter', referencedColumnName: 'id_person' },
    ])
    @ManyToOne(() => Person)
    person: Person;

    @Column()
    responsible: number;

    @Column()
    submitter: number;

    @Column()
    document: string;

    @Column()
    completion: number;

    @Column()
    planned_start_date: Date;

    @Column()
    planned_end_date: Date;

    @Column()
    actual_start_date: Date;

    @Column()
    actual_end_date: Date;
}

export { Project };
