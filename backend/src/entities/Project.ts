import {Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('Project')
class Project {
    @PrimaryColumn()
    idProject: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    idResponsible: number;
    
    @Column()
    idSubmitter: number;

    @Column()
    document: string;

    @Column()
    idPortfolio: number;

    @Column()
    idStatus: number;

    @Column()
    idCategory: number;

    @Column()
    completion: number;

    @Column()
    plannedStartDate: Date;

    @Column()
    plannedEndDate: Date;

    @Column()
    actualStartDate: Date;

    @Column()
    actualEndDate: Date;
}

export { Project };