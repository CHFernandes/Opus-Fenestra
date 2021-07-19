import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class CreateStrategicPlannings1626217505395 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'strategic_planning',
                columns: [
                    {
                        name: 'id_planning',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'id_organization',
                        type: 'integer',
                    },
                    {
                        name: 'validity',
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
                        name: 'FKPlanning',
                        referencedTableName: 'organization',
                        referencedColumnNames: ['id_organization'],
                        columnNames: ['id_organization'],
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('strategic_planning');
    }

}
