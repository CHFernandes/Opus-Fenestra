import { EntityRepository, Repository } from 'typeorm';
import { Organization } from '../entities/Organization';

@EntityRepository(Organization)
class OrganizationsRepository extends Repository<Organization> {}

export {OrganizationsRepository};