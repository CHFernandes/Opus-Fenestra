import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { Person } from './Person';
import { Project } from './Project';
import { Status } from './Status';

@Entity('project_status')
class ProjectStatus {
    @PrimaryGeneratedColumn()
    id_project_status: number;

    @JoinColumn({ name: 'id_person' })
    @ManyToOne(() => Person)
    person: Person;

    @Column()
    id_person: number;

    @JoinColumn({ name: 'id_project' })
    @ManyToOne(() => Project)
    project: Project;

    @Column()
    id_project: number;

    @JoinColumn({ name: 'id_status' })
    @ManyToOne(() => Status)
    status: Status;

    @Column()
    id_status: number;

    @Column()
    changed_time: Date;
}

export { ProjectStatus };
