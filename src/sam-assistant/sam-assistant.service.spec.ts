import { Test, TestingModule } from '@nestjs/testing';
import { SamAssistantService } from './sam-assistant.service';

describe('SamAssistantService', () => {
  let service: SamAssistantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SamAssistantService],
    }).compile();

    service = module.get<SamAssistantService>(SamAssistantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
