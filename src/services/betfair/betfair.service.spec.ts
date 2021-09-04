import { Test, TestingModule } from '@nestjs/testing';
import { BetfairService } from './betfair.service';

describe('BetfairService', () => {
  let service: BetfairService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BetfairService],
    }).compile();

    service = module.get<BetfairService>(BetfairService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
