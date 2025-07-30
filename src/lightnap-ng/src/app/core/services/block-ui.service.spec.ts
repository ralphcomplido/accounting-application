import { TestBed } from "@angular/core/testing";
import { BlockUiService } from "./block-ui.service";
import { BlockUiParams } from "@core/models";
import { provideZonelessChangeDetection } from "@angular/core";

describe("BlockUiService", () => {
  let service: BlockUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(BlockUiService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should emit show event with correct parameters", done => {
    const blockUiParams: BlockUiParams = { message: "Loading..." };
    service.onShow$.subscribe(params => {
      expect(params).toEqual(blockUiParams);
      done();
    });
    service.show(blockUiParams);
  });

  it("should emit hide event", done => {
    service.onHide$.subscribe(() => {
      expect(true).toBeTrue();
      done();
    });
    service.hide();
  });
});
