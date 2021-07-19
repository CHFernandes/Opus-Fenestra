import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class CreateUnityGrades1626556646432 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'unity_grades',
                columns: [
                    {
                        name: 'id_unity_grade',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'id_unities',
                        type: 'integer',
                    },
                    {
                        name: 'id_customized_grades',
                        type: 'integer',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'FKUnityGradesUnities',
                        referencedTableName: 'unities',
                        referencedColumnNames: ['id_unities'],
                        columnNames: ['id_unities'],
                    },
                    {
                        name: 'FKUnityGradesCustomizedGrades',
                        referencedTableName: 'customized_grades',
                        referencedColumnNames: ['id_customized_grades'],
                        columnNames: ['id_customized_grades'],
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('unity_grades');
    }

}
