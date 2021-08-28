import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Organization } from './Organization';
import { Person } from './Person';

@Entity('portfolio')
class Portfolio {
    @PrimaryGeneratedColumn()
    id_portfolio: number;

    @JoinColumn({ name: 'id_person'})
    @ManyToOne(() => Person)
    person: Person;

    @Column()
    id_person: number;

    @JoinColumn({ name: 'id_organization'})
    @ManyToOne(() => Organization)
    organization: Organization;

    @Column()
    id_organization: number;

    @Column()
    description: string;

    @Column()
    objective: string;
}

export { Portfolio };