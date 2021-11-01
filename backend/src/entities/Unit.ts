import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('unities')
class Unit {
    @PrimaryGeneratedColumn()
    id_unities: number;

    @Column()
    description: string;

    @Column()
    best_values: number;

    @Column()
    worst_values: number;

    @Column()
    is_values_manual: boolean;

    @Column()
    best_manual_value: number;

    @Column()
    worst_manual_value: number;
}

export { Unit };
