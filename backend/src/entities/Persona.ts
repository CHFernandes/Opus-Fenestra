import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('persona')
class Persona {
    @PrimaryColumn()
    id_persona: number;

    @Column()
    type_persona: string;
}

export { Persona };
