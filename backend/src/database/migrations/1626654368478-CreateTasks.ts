import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class CreateTasks1626654368478 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'task',
                columns: [
                    {
                        name: 'id_task',
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
                        name: 'description',
                        type: 'varchar',
                    },
                    {
                        name: 'completion',
                        type: 'integer',
                    },
                    {
                        name: 'planned_start_date',
                        type: 'timestamp',
                        isNullable: true
                    },
                    {
                        name: 'planned_end_date',
                        type: 'timestamp',
                        isNullable: true
                    },
                    {
                        name: 'actual_start_date',
                        type: 'timestamp',
                        isNullable: true
                    },
                    {
                        name: 'actual_end_date',
                        type: 'timestamp',
                        isNullable: true
                    },
                ],
                foreignKeys: [
                    {
                        name: 'FKTaskProject',
                        referencedTableName: 'project',
                        referencedColumnNames: ['id_project'],
                        columnNames: ['id_project'],
                    },
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('task');
    }

}
