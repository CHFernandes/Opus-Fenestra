import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class CreateOrganizations1626216607563 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'organization',
                columns: [
                    {
                        name: 'id_organization',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'mission',
                        type: 'varchar',
                    },
                    {
                        name: 'values',
                        type: 'varchar',
                    },
                    {
                        name: 'vision',
                        type: 'varchar',
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('organization');
    }

}
