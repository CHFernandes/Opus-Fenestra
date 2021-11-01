import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProjects1626648936004 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'project',
                columns: [
                    {
                        name: 'id_project',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'id_status',
                        type: 'integer',
                    },
                    {
                        name: 'id_category',
                        type: 'integer',
                        isNullable: true,
                    },
                    {
                        name: 'id_portfolio',
                        type: 'integer',
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },

                    {
                        name: 'responsible',
                        type: 'integer',
                        isNullable: true,
                    },
                    {
                        name: 'submitter',
                        type: 'integer',
                    },
                    {
                        name: 'document',
                        type: 'blob',
                        isNullable: true,
                    },
                    {
                        name: 'completion',
                        type: 'integer',
                    },
                    {
                        name: 'planned_start_date',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'planned_end_date',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'actual_start_date',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'actual_end_date',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],
                foreignKeys: [
                    {
                        name: 'FKProjectStatus',
                        referencedTableName: 'status',
                        referencedColumnNames: ['id_status'],
                        columnNames: ['id_status'],
                    },
                    {
                        name: 'FKProjectCategory',
                        referencedTableName: 'category',
                        referencedColumnNames: ['id_category'],
                        columnNames: ['id_category'],
                    },
                    {
                        name: 'FKProjectPortfolio',
                        referencedTableName: 'portfolio',
                        referencedColumnNames: ['id_portfolio'],
                        columnNames: ['id_portfolio'],
                    },
                    {
                        name: 'FKProjectResponsible',
                        referencedTableName: 'person',
                        referencedColumnNames: ['id_person'],
                        columnNames: ['responsible'],
                    },
                    {
                        name: 'FKProjectSubmitter',
                        referencedTableName: 'person',
                        referencedColumnNames: ['id_person'],
                        columnNames: ['submitter'],
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('project');
    }
}
