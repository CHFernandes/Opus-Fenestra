import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUnities1626555514280 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'unities',
                columns: [
                    {
                        name: 'id_unities',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                    },
                    {
                        name: 'best_values',
                        type: 'integer',
                        isNullable: true,
                    },
                    {
                        name: 'worst_values',
                        type: 'integer',
                        isNullable: true,
                    },
                    {
                        name: 'is_values_manual',
                        type: 'boolean',
                    },
                    {
                        name: 'best_manual_value',
                        type: 'real',
                        isNullable: true,
                    },
                    {
                        name: 'worst_manual_value',
                        type: 'real',
                        isNullable: true,
                    },
                ],
                foreignKeys: [
                    {
                        name: 'FKUnityBestValue',
                        referencedTableName: 'customized_grades',
                        referencedColumnNames: ['id_customized_grades'],
                        columnNames: ['best_values'],
                    },
                    {
                        name: 'FKUnityWorstValue',
                        referencedTableName: 'customized_grades',
                        referencedColumnNames: ['id_customized_grades'],
                        columnNames: ['worst_values'],
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('unities');
    }
}
