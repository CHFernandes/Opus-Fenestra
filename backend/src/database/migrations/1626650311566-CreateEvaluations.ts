import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateEvaluations1626650311566 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'evaluation',
                columns: [
                    {
                        name: 'id_evaluation',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'id_project',
                        type: 'integer',
                    },
                    {
                        name: 'id_criteria',
                        type: 'integer',
                    },
                    {
                        name: 'evaluation_date',
                        type: 'timestamp',
                    },
                    {
                        name: 'value',
                        type: 'integer',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'FKEvaluationProject',
                        referencedTableName: 'project',
                        referencedColumnNames: ['id_project'],
                        columnNames: ['id_project'],
                    },
                    {
                        name: 'FKEvaluationCriteria',
                        referencedTableName: 'criteria',
                        referencedColumnNames: ['id_criteria'],
                        columnNames: ['id_criteria'],
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('evaluation');
    }
}
