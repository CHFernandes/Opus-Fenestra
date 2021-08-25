import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('organization')
class Organization {
    @PrimaryGeneratedColumn()
    id_organization: number;

    @Column()
    name: string;

    @Column()
    mission: string;

    @Column()
    values: string;

    @Column()
    vision: string;
}

export { Organization };