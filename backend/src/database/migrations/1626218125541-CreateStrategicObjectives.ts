import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class CreateStrategicObjectives1626218125541 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'strategic_objective',
                columns: [
                    {
                        name: 'id_objective',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'id_planning',
                        type: 'integer',
                    },
                    {
                        name: 'date',
                        type: 'timestamp',
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'FKObjective',
                        referencedTableName: 'strategic_planning',
                        referencedColumnNames: ['id_planning'],
                        columnNames: ['id_planning'],
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('strategic_objective');
    }

}
