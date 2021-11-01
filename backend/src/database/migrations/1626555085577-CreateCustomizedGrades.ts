import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCustomizedGrades1626555085577 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'customized_grades',
                columns: [
                    {
                        name: 'id_customized_grades',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'numeric_value',
                        type: 'integer',
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('customized_grades');
    }
}
