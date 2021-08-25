import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Organization } from './Organization';
import { Persona } from './Persona';

@Entity('person')
class Person {
    @PrimaryGeneratedColumn()
    id_person: number;

    @JoinColumn({ name: 'id_persona'})
    @ManyToOne(() => Persona)
    persona: Persona;

    @Column()
    id_persona: number;

    @JoinColumn({ name: 'id_organization'})
    @ManyToOne(() => Organization)
    organization: Organization;

    @Column()
    id_organization: number;

    @Column()
    name: string;

    @Column()
    user: string;

    @Column()
    email: string;

    @Column()
    password: string;
}

export { Person };