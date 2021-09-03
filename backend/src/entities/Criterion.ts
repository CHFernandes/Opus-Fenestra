import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Portfolio } from './Portfolio';
import { Unit } from './Unit';

@Entity('criteria')
class Criterion {
    @PrimaryGeneratedColumn()
    id_criteria: number;

    @JoinColumn({ name: 'id_portfolio'})
    @ManyToOne(() => Portfolio)
    portfolio: Portfolio;

    @Column()
    id_portfolio: number;

    @Column()
    description: string;

    @Column()
    weight: number;

    @JoinColumn({ name: 'id_unities'})
    @ManyToOne(() => Unit)
    unit: Unit;

    @Column()
    id_unities: number;
}

export { Criterion };