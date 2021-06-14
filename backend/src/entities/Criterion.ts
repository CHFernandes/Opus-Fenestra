import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('Criteria')
class Criterion {
    @PrimaryColumn()
    idCriteria: number;

    @Column()
    description: string;

    @Column()
    weight: number;

    @Column()
    unityType: string;

    @Column()
    bestValue: number;

    @Column()
    worstValue: number;

    @Column()
    idPortfolio: number;
}

export { Criterion };