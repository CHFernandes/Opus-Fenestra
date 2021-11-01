import { EntityRepository, Repository } from 'typeorm';
import { Portfolio } from '../entities/Portfolio';

@EntityRepository(Portfolio)
class PortfoliosRepository extends Repository<Portfolio> {}

export { PortfoliosRepository };
