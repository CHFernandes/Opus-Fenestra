import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProjectStatus1626654611770 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'project_status',
                columns: [
                    {
                        name: 'id_project_status',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'id_person',
                        type: 'integer',
                    },
                    {
                        name: 'id_project',
                        type: 'integer',
                    },
                    {
                        name: 'id_status',
                        type: 'integer',
                    },
                    {
                        name: 'changed_time',
                        type: 'timestamp',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'FKProjectStatusPerson',
                        referencedTableName: 'person',
                        referencedColumnNames: ['id_person'],
                        columnNames: ['id_person'],
                    },
                    {
                        name: 'FKProjectStatusProject',
                        referencedTableName: 'project',
                        referencedColumnNames: ['id_project'],
                        columnNames: ['id_project'],
                    },
                    {
                        name: 'FKProjectStatusStatus',
                        referencedTableName: 'status',
                        referencedColumnNames: ['id_status'],
                        columnNames: ['id_status'],
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('project_status');
    }
}
