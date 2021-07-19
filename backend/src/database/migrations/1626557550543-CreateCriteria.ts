import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class CreateCriteria1626557550543 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'criteria',
                columns: [
                    {
                        name: 'id_criteria',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
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
                        name: 'weight',
                        type: 'real',
                    },
                    {
                        name: 'id_unities',
                        type: 'integer',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'FKPortfolioCriteria',
                        referencedTableName: 'portfolio',
                        referencedColumnNames: ['id_portfolio'],
                        columnNames: ['id_portfolio'],
                    },
                    {
                        name: 'FKUnitiesCriteria',
                        referencedTableName: 'unities',
                        referencedColumnNames: ['id_unities'],
                        columnNames: ['id_unities'],
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('criteria');
    }

}
