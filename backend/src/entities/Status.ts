import {Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('status')
class Status {
    @PrimaryColumn()
    id_status: number;

    @Column()
    description: string;
}

export { Status };