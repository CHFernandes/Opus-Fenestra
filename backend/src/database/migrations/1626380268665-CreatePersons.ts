import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePersons1626380268665 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'person',
                columns: [
                    {
                        name: 'id_person',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'id_persona',
                        type: 'integer',
                    },
                    {
                        name: 'id_organization',
                        type: 'integer',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'user',
                        type: 'varchar',
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'FKPersona',
                        referencedTableName: 'persona',
                        referencedColumnNames: ['id_persona'],
                        columnNames: ['id_persona'],
                    },
                    {
                        name: 'FKPersonOrganization',
                        referencedTableName: 'organization',
                        referencedColumnNames: ['id_organization'],
                        columnNames: ['id_organization'],
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('person');
    }
}
