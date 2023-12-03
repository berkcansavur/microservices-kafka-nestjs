import { Test, TestingModule } from "@nestjs/testing";
import { CustomerRepresentativeService } from "./customer-representative.service";

describe("CustomerRepresentativeService", () => {
  let service: CustomerRepresentativeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerRepresentativeService],
    }).compile();

    service = module.get<CustomerRepresentativeService>(
      CustomerRepresentativeService,
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
