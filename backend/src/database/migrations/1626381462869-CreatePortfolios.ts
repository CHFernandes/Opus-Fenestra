import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class CreatePortfolios1626381462869 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'portfolio',
                columns: [
                    {
                        name: 'id_portfolio',
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
                        name: 'id_organization',
                        type: 'integer',
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                    },
                    {
                        name: 'objective',
                        type: 'varchar',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'FKPortfolioPerson',
                        referencedTableName: 'person',
                        referencedColumnNames: ['id_person'],
                        columnNames: ['id_person'],
                    },
                    {
                        name: 'FKPortfolioOrganization',
                        referencedTableName: 'organization',
                        referencedColumnNames: ['id_organization'],
                        columnNames: ['id_organization'],
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('portfolio');
    }

}
